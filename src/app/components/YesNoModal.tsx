"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useT } from "@/app/i18n/useT";

export default function YesNoModal({
  open,
  title,
  description,
  yesText,
  noText,
  onYes,
  onNo,
  loading = false,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  yesText?: string;
  noText?: string;
  onYes: () => void | Promise<void>;
  onNo: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}) {
  const t = useT();
  const resolvedYesText = yesText ?? t("common.yes");
  const resolvedNoText = noText ?? t("common.no");

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onNo}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2 scale-[0.98]"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-2 scale-[0.98]"
            >
              <Dialog.Panel className="w-full max-w-lg lux-card lux-rect p-5 sm:p-6 border border-white/10 shadow-2xl">
                <Dialog.Title className="text-lg sm:text-xl font-semibold text-white">
                  {title}
                </Dialog.Title>
                {description ? (
                  <Dialog.Description className="mt-2 text-sm text-white/70">
                    {description}
                  </Dialog.Description>
                ) : null}

                {children ? <div className="mt-4">{children}</div> : null}

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onNo}
                    className="lux-btn-ghost px-4 py-2 text-sm text-white/85"
                    disabled={loading}
                  >
                    {resolvedNoText}
                  </button>
                  <button
                    type="button"
                    onClick={() => void onYes()}
                    className="lux-btn-metal px-4 py-2 text-sm font-semibold"
                    disabled={loading}
                  >
                    {resolvedYesText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
