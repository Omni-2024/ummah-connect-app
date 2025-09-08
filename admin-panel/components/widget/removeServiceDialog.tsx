import React, { useState } from "react";
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

type RemoveServiceDialogProps = {
    enrollmentCount: number;
    onSoftDelete: () => void;
    onHardDelete: () => void;
    onClose: () => void;
    open: boolean;
    loading: boolean;
    children?: React.ReactNode;
};

const RemoveServiceDialog: React.FC<RemoveServiceDialogProps> = (props) => {
    const [confirmationText, setConfirmationText] = useState("");
    const isSoftDelete = props.enrollmentCount > 0;
    const requiredConfirmationText = "Delete";

    const isValid = confirmationText === requiredConfirmationText;

    const handleDelete = () => {
        if (isValid) {
            isSoftDelete ? props.onSoftDelete() : props.onHardDelete();
        }
    };

    return (
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
                        {isSoftDelete ? "Soft Delete?" : "Hard Delete?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-dark-400">
                        {isSoftDelete ? (
                            <>
                                This service has <strong>{props.enrollmentCount}</strong> enrolled
                                users. Performing a soft delete will:
                                <ul className="list-disc ml-6 mt-2">
                                    <li>Allow currently enrolled users to continue accessing the service.</li>
                                    <li>Prevent new users from enrolling or seeing the service.</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                This service has <strong>0 enrollments</strong>. Performing a hard delete will:
                                <ul className="list-disc ml-6 mt-2">
                                    <li>Immediately and permanently delete the service.</li>
                                    <li>Remove all associated data with no recovery option.</li>
                                </ul>
                            </>
                        )}
                        <p className="mt-4">
                            To confirm, please type <strong>{`${requiredConfirmationText}`}</strong> below.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="mt-4">
                    <input
                        type="text"
                        id="confirmationText"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder={requiredConfirmationText}
                        className={`w-full border rounded px-4 py-2 ${isValid ? "border-gray-300" : "border-red-500"
                            }`}
                    />
                    {!isValid && (
                        <p className="text-red-500 text-sm mt-2">
                            Please type {`${requiredConfirmationText}`} to confirm.
                        </p>
                    )}
                </div>

                <AlertDialogFooter className="mt-6">
                    <Button
                        disabled={props.loading}
                        variant="secondary"
                        className="border-dark-300 text-dark-300 hover:bg-dark-50 active:bg-dark-100 active:text-dark-400"
                        onClick={props.onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={props.loading || !isValid}
                        className={`${isSoftDelete
                            ? "bg-status-yellow hover:bg-status-yellow/80 active:bg-yellow-600"
                            : "bg-status-red hover:bg-status-red/80 active:bg-red-800"
                            } w-40`}
                    >
                        {props.loading ? <Spinner color="white" /> : <>Yes, {isSoftDelete ? "soft delete" : "hard delete"}</>}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RemoveServiceDialog;
