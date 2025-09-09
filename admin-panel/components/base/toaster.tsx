import { Toaster as HotToaster, toast, ToasterProps } from "react-hot-toast";

const Toaster: React.FC<ToasterProps> = ({ toastOptions, ...props }) => {
  return (
      <HotToaster toastOptions={{ duration: 1500, ...toastOptions }} {...props} />
  );
};

export default Toaster;
export { toast as Toast };
