"use client";

import { uploadImage } from "@/app/actions/upload";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploaderProps {
  productId: string;
  onUploadComplete?: (url?: string) => void;
  maxImages?: number;
}

export default function ImageUploader({
  productId,
  onUploadComplete,
  maxImages = 10,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<
    { url: string | undefined; order: number }[]
  >([]);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイル選択時の処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // プレビュー表示用のURL生成
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setError(null);

      // フォームの自動送信
      if (e.target.form) {
        e.target.form.requestSubmit();
      }

      // クリーンアップ関数
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // アップロード中の進捗表示（実際のファイルの進捗ではなくアニメーション）
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // FormDataの作成
      const formData = new FormData(e.currentTarget);

      // 現在のアップロード順序を設定
      formData.set("order", uploadedImages.length.toString());

      // Server Actionの呼び出し
      const result = await uploadImage(formData);

      clearInterval(progressInterval);

      if (result.success) {
        setUploadProgress(100);

        // 成功時の処理
        const newImage = {
          url: result.url,
          order: uploadedImages.length,
        };

        if (newImage.url !== undefined) {
          setUploadedImages((prev) => [...prev, newImage]);
          setPreview(null);

          // コールバック関数があれば呼び出し
          if (onUploadComplete) {
            onUploadComplete(result.url);
          }

          // ファイル入力をリセット
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          // エラー時の処理
          setError(result.error ? result.error : "アップロードに失敗しました");
          setUploadProgress(0);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "予期せぬエラーが発生しました");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  // 画像を削除する処理（オプション - 実際にはServer Actionが必要）
  const handleRemoveImage = (index: number) => {
    // 実際のアプリでは削除用のServer Actionを呼び出す
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">商品画像</h3>
        <p className="text-sm text-gray-500 mb-4">
          画像は最大{maxImages}枚までアップロードできます。
          JPG、PNG、GIF、WEBP形式（5MB以下）に対応しています。
        </p>

        {/* アップロード済み画像のプレビュー */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {uploadedImages.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
              >
                <Image
                  src={image.url || ""}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 250px"
                  style={{ objectFit: "cover" }}
                  className="bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="画像を削除"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Delete Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2">
                  {index === 0 ? "メイン画像" : `画像 ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 新規アップロードフォーム */}
        {uploadedImages.length < maxImages && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="productId" value={productId} />

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {preview ? (
                // 選択した画像のプレビュー
                <div className="relative aspect-video w-full max-w-md mx-auto">
                  <Image
                    src={preview}
                    alt="Upload preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: "contain" }}
                    className="rounded-md bg-gray-50"
                  />
                </div>
              ) : (
                // アップロード領域
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center h-40 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Upload Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    {isUploading ? "アップロード中..." : "クリックして画像を選択"}
                  </span>
                  <span className="text-xs mt-1">JPG, PNG, GIF, WEBP (最大 5MB)</span>
                </label>
              )}

              <input
                ref={fileInputRef}
                id="image-upload"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </div>

            {/* 進行状況バー */}
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <span className="sr-only">{uploadProgress}%</span>
                </div>
              </div>
            )}

            {/* エラーメッセージ */}
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

            {/* 選択した画像があれば送信ボタンを表示 */}
            {preview && (
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isUploading}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isUploading}
                >
                  {isUploading ? "アップロード中..." : "アップロード"}
                </button>
              </div>
            )}
          </form>
        )}

        {/* 最大画像数に達した場合のメッセージ */}
        {uploadedImages.length >= maxImages && (
          <div className="text-amber-600 text-sm bg-amber-50 p-3 rounded-md">
            最大画像数（{maxImages}
            枚）に達しました。新しい画像をアップロードするには、既存の画像を削除してください。
          </div>
        )}
      </div>
    </div>
  );
}
