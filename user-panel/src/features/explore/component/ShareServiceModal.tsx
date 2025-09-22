import { Copy, Sms } from "iconsax-react";
import {
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  XIcon,
} from "react-share";
import { useCopyToClipboard } from "usehooks-ts";

import ResponsiveDialog from "@/components/base/ResponsiveDialog";
import { Toast } from "@/components/base/Toast";
import { useService } from "@/lib/hooks/useServices";
import { useEffect, useState } from "react";
import { APP_BASE_URL } from "@/lib/constants";
import {useAppState} from "@/features/app/context/useAppState";

const ShareServiceModal = () => {
  const {showServiceShareModal,serviceId,setShowServiceShareModal}=useAppState()
  const [_copiedText, copyToClipboard] = useCopyToClipboard();
  const [service_link, setServiceLink] = useState<string>("");

  const { data: service } = useService(serviceId ?? "");

  useEffect(() => {
    if (service) {
      setServiceLink(`${APP_BASE_URL}/service/${service.slug}`);
    }
  }, [service]);

  const handleModalChange = (show: boolean) => {
    setShowServiceShareModal(show)
  };

  const handleCopyLink = () => {
    copyToClipboard(service_link);
    Toast.success("Link copied to clipboard", { id: "copy-service-link" });
  };

  return (
    <ResponsiveDialog
      setShow={handleModalChange}
      show={Boolean(showServiceShareModal)}
      title="Share this service"
    >
      <div className="max-w-lg">
        <div className="space-y-5 p-5">
          <div
            onClick={handleCopyLink}
            className="flex cursor-pointer select-all items-center justify-between gap-4 rounded-xl border px-5 py-2.5"
          >
            <h2 className="line-clamp-1 text-sm text-dark-400">
              {service_link}
            </h2>
            <Copy color="black" className="size-5" />
          </div>

          <div className="flex items-center justify-center gap-5">
            <EmailShareButton
              color="white"
              url={service_link}
              separator=" - "
              body="Check out this service on Ummah connect"
              subject="Check out this service on Ummah connect"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-primary-500">
                <Sms color="white" className="size-5 text-white" variant="Bold" />
              </div>
            </EmailShareButton>

            <TwitterShareButton
              url={service_link}
              title="Check out this service on Ummah connect"
              hashtags={["UmmahConnect"]}
            >
              <XIcon className="size-8" round />
            </TwitterShareButton>

            <FacebookShareButton
              url={service_link}
              hashtag="UmmahConnect"
              title="Check out this service on Ummah connect"
            >
              <FacebookIcon className="size-8" round />
            </FacebookShareButton>

            <LinkedinShareButton url={service_link}>
              <LinkedinIcon className="size-8" round />
            </LinkedinShareButton>
          </div>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default ShareServiceModal;
