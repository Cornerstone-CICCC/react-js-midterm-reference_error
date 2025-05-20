"use server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const uploadImage = async (formData: FormData) => {
  try {
    // FormDataから画像ファイルを取得
    const file = formData.get("image") as File;
    const productId = formData.get("productId") as string;
    const order = formData.get("order") as string;
    if (!file || file.size === 0) {
      return { success: false, error: "ファイルが選択されていません" };
    }

    // ファイルサイズのチェック (5MB制限)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "ファイルサイズは5MB以下にしてください" };
    }

    // ファイル形式のチェック
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "対応していないファイル形式です。JPG, PNG, GIF, WEBPのみ対応しています",
      };
    }

    // ファイル名の生成
    const filePath = `${productId}/${order}`;

    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    // Supabaseクライアントの初期化
    const supabase = await createServerClient();
    // Supabaseにアップロード
    const { data, error } = await supabase.storage
      .from("products") // バケット名
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    console.info("Upload data:", data);

    if (error) {
      console.error("Upload error:", error);
      return { success: false, error: `アップロードエラー: ${error.message}` };
    }

    // 公開URLの取得
    const { data: urlData } = supabase.storage.from("products").getPublicUrl(filePath);

    // 必要に応じて画像メタデータをデータベースに保存
    // 例: await supabase.from('image_metadata').insert({url: urlData.publicUrl, ...})

    // キャッシュを再検証して最新の画像を表示
    revalidatePath("/uploads"); // アップロード一覧ページなどがあれば

    return {
      success: true,
      url: urlData.publicUrl,
      fileName: filePath,
    };
  } catch (err) {
    console.error("Unhandled error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "予期せぬエラーが発生しました",
    };
  }
};
