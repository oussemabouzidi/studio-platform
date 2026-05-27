"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function ErrorModal({
  open,
  title,
  message,
  closeText = "OK",
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  closeText?: string;
  onClose: () => void;
}) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
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

                <Dialog.Description className="mt-2 text-sm text-white/80">
                  {message}
                </Dialog.Description>

                <div className="mt-6 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="lux-btn-metal px-4 py-2 text-sm font-semibold"
                  >
                    {closeText}
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
