import type { FormEvent } from "react";

type Props = {
  onSaveDraft: () => void;
  onSubmit: (e: FormEvent) => void;
  saveDraftLabel?: string;
  submitLabel?: string;
  termsText?: string;
  termsLink?: string;
};

export function FormActions({
  onSaveDraft,
  onSubmit,
  saveDraftLabel = "Save as Draft",
  submitLabel = "List Item",
  termsText = "By listing, you agree to our",
  termsLink = "/",
}: Props) {
  return (
    <>
      <div className="flex space-x-2 my-6">
        <button
          type="button"
          onClick={onSaveDraft}
          className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-50"
        >
          {saveDraftLabel}
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-md hover:bg-orange-600"
        >
          {submitLabel}
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        {termsText}{" "}
        <a href={termsLink} className="text-blue-500">
          Terms & Privacy
        </a>
      </div>
    </>
  );
}
