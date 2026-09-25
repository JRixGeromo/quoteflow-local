interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-neutral-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="flex w-full max-w-[440px] flex-col gap-3 rounded-[7px] bg-surface p-5 shadow-lg">
        <h2 id="confirm-dialog-title" className="font-heading text-xl font-semibold text-ink">
          {title}
        </h2>
        <p className="text-sm text-ink/85">{message}</p>
        <div className="mt-2 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="border border-[color:var(--color-divider)] px-4 py-2 font-heading text-sm font-semibold text-ink hover:bg-ink/[0.07]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="border border-[#a13c2c] bg-[#a13c2c] px-4 py-2 font-heading text-sm font-semibold text-white hover:bg-[#8a3224]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
