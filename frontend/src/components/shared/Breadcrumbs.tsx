import { HiChevronRight } from "react-icons/hi";

type BreadcrumbsProps = {
  title: string;
  category: string;
  subCategory: string | undefined;
};

export function Breadcrumbs({ title, category, subCategory }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-1 py-4 text-sm text-gray-500">
      {/* ホームへのリンク - 常に表示 */}
      <a href="/" className="hover:underline">
        Home
      </a>

      {/* カテゴリへのリンク - 常に表示 */}
      <HiChevronRight className="mx-1" />
      <a href={`/category/${category}`} className="hover:underline">
        {category}
      </a>

      {/* サブカテゴリへのリンク - サブカテゴリがある場合のみ表示 */}
      {subCategory && (
        <>
          <HiChevronRight className="mx-1" />
          <a href={`/category/${category}/${subCategory}`} className="hover:underline">
            {subCategory}
          </a>
        </>
      )}

      {/* 現在のページタイトル - 常に表示 */}
      <HiChevronRight className="mx-1" />
      <span className="font-bold">{title}</span>
    </div>
  );
}
