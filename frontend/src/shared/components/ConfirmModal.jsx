import { FiX, FiAlertTriangle } from "react-icons/fi";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", confirmButtonClass = "bg-red-600 hover:bg-red-700" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal positioning */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>

          <div className="bg-white px-5 pt-7 pb-5 sm:p-7">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                <FiAlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-6 sm:text-left flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-5 py-4 sm:px-7 sm:py-5 flex flex-col-reverse sm:flex-row-reverse gap-3">
            <button
              type="button"
              onClick={onConfirm}
              className={`w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-5 py-2.5 text-sm sm:text-base font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-full border-2 border-gray-300 shadow-sm px-5 py-2.5 bg-white text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 sm:w-auto"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
