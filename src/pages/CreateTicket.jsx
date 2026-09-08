import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, ArrowLeft, AlertCircle } from "lucide-react";
import { Button, Input } from "../components";
import { useApp } from "../context/useApp";

export default function CreateTicket({ onSubmitTicket, onCancel }) {
  const navigate = useNavigate();
  const { addTicket } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/faq");
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        file: "Please select an image file (PNG, JPG, etc.)",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, file: null }));

    const reader = new FileReader();

    reader.onload = (e) => {
      setAttachment({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        previewUrl: e.target.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Please provide an issue title";
    }

    if (!description.trim()) {
      newErrors.description = "Please describe the issue in detail";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const generatedId = `TKT-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      const ticketPayload = {
        id: generatedId,
        title,
        description,
        attachment,
        status: "Pending",
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      if (onSubmitTicket) {
        onSubmitTicket(ticketPayload);
      } else {
        addTicket(ticketPayload);
        navigate("/faq");
      }
    }, 500);
  };

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-7 flex items-start gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Raise a Complaint
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-500">
              Provide the details of your issue so our support team can assist
              you.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] sm:p-7"
        >
          <div className="space-y-5">
            <Input
              id="ticket-title"
              label="Issue Title"
              type="text"
              placeholder="Brief summary of the issue"
              required
              value={title}
              error={errors.title}
              onChange={(e) => {
                setTitle(e.target.value);

                if (errors.title) {
                  setErrors({ ...errors, title: null });
                }
              }}
            />

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="ticket-desc"
                className="block text-sm font-medium text-gray-700"
              >
                Issue Description{" "}
                <span className="text-red-500">*</span>
              </label>

              <textarea
                id="ticket-desc"
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);

                  if (errors.description) {
                    setErrors({ ...errors, description: null });
                  }
                }}
                placeholder="Explain what happened, steps to reproduce, or any relevant details..."
                required
                className={`w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 ${
                  errors.description
                    ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                }`}
              />

              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-medium text-gray-700">
                Attachment{" "}
                <span className="font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              {!attachment ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-xl border border-dashed p-7 text-center transition-colors ${
                    dragActive
                      ? "border-[#0084ff] bg-[#0084ff]/5"
                      : "border-gray-300 bg-gray-50/70 hover:border-[#0084ff]/60 hover:bg-[#0084ff]/[0.03]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={(e) =>
                      handleFile(e.target.files?.[0])
                    }
                  />

                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0084ff]/10 text-[#0084ff]">
                    <Upload size={19} />
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    Drop an image here or{" "}
                    <span className="text-[#0084ff]">
                      browse files
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    PNG or JPG · Maximum 10MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={attachment.previewUrl}
                      alt="Attachment preview"
                      className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {attachment.name}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {attachment.size}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white hover:text-gray-700 cursor-pointer"
                    title="Remove image"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              {errors.file && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={13} />
                  {errors.file}
                </p>
              )}
            </div>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-2.5 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
            >
              Cancel
            </button>

            <Button type="submit" isLoading={isSubmitting}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
