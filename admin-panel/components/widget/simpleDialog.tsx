import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/base/AlertDialog";
import Button from "@/components/base/button";
import Spinner from "@/components/base/Spinner";

type SimpleDialogProps = {
  children?: React.ReactNode;
  title: string;
  description: string;
  onRemove: () => void;
  onClose: () => void;
  open: boolean;
  loading: boolean;
};

const SimpleDialog: React.FC<SimpleDialogProps> = (props) => {
  return (
    <>
      <AlertDialog
        open={props.open}
        onOpenChange={(e) => {
          if (!props.loading) props.onClose();
        }}
      >
        {props.children}
        <AlertDialogContent className="!rounded-3xl p-8 gap-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-xl font-primary">
              {props.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-dark-400">
              {props.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button
              disabled={props.loading}
              variant="secondary"
              className="border-dark-300 text-dark-300 hover:bg-dark-50 active:bg-dark-100 active:text-dark-400"
              onClick={() => props.onClose()}
            >
              Cancel
            </Button>
            <Button
              onClick={props.onRemove}
              disabled={props.loading}
              className="bg-status-red hover:bg-status-red/80 active:bg-red-800  w-40"
            >
              {props.loading ? <Spinner color="white" /> : <>Continue</>}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SimpleDialog;
