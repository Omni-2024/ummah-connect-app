import {Card, CardContent} from "@/components/base/card";
import envs from "@/lib/env";
import Button from "@/components/base/button";
import {Edit, Trash,Expand} from "lucide-react";
import LinkButton from "@/components/base/LinkButton";
import RemoveServiceDialog from "@/components/widget/removeServiceDialog";
// import {Export, Trash} from "iconsax-react";
import {Badge} from "@/components/base/badge";
import {archiveServiceFn, Service} from "@/lib/endpoints/serviceFns";
import {useGeneralUser} from "@/lib/hooks/useGeneralUsers";
import {useMutation} from "@tanstack/react-query";
import {Toast} from "@/components/base/toast";
import {useState} from "react";

type ServiceCardProps = {
    service: Service;
    refetchAll: () => void;
};

const ProviderAvatar=({ providerId, alt }: { providerId: string; alt?: string })=>{
    const { data: provider, isLoading } = useGeneralUser(providerId);

    console.log("ttt",provider)

    const src = provider?.profileImage
        ? `${provider.profileImage}`
        : "/fallback-avatar.png";

    return (
        <img
            src={src}
            alt={alt ?? provider?.name ?? "Provider"}
            className="w-10 h-10 rounded-full border-2 border-white"
            style={{ opacity: isLoading ? 0.7 : 1 }}
        />
    );
}


const ServiceCard: React.FC<ServiceCardProps> = (props) => {
    const [imageError, setImageError] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

    const { mutate: softDeleteService, isPending: isSoftDeleteLoading } = useMutation({
        mutationFn: () => archiveServiceFn(props.service.id),
        onSuccess: () => {
            setRemoveDialogOpen(false);
            Toast.success("Service soft deleted successfully");
            props.refetchAll();
        },
        onError: () => {
            Toast.error("Failed to soft delete service");
        },
    });

    const { mutate: hardDeleteService, isPending: isHardDeleteLoading } = useMutation({
        mutationFn: () => archiveServiceFn(props.service.id),
        onSuccess: () => {
            setRemoveDialogOpen(false);
            Toast.success("Service hard deleted successfully");
            props.refetchAll();
        },
        onError: () => {
            Toast.error("Failed to hard delete service");
        },
    });


    return (
        <Card key={props.service.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
                {/* Service Image */}
                <div className="relative">
                    <img
                        src={`${envs.imageBaseUrl}/${props.service.coverImageUrl}`}
                        alt={props.service.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                        {/*<Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">*/}
                        {/*    <Eye className="h-4 w-4" />*/}
                        {/*</Button>*/}
                        <LinkButton
                            href={`services/edit/${props.service.id}`}
                            variant="icon"
                            className="w-10 px-0 shrink-0 rounded-lg border border-primary-500 text-primary-500"
                        >
                            <Edit className="h-4 w-4" />
                        </LinkButton>
                        <LinkButton
                            target="_blank"
                            variant="icon"
                            href={`${envs.mainBaseUrl}/service/${props.service.slug}`}
                            className="w-10 px-0 shrink-0 rounded-lg border border-primary-500 text-primary-500"
                            title="View Service"
                        >
                            <Expand  className="h-4 w-4" />
                        </LinkButton>
                        <RemoveServiceDialog
                            enrollmentCount={props.service.enrollmentCount}
                            onSoftDelete={() => softDeleteService()}
                            onHardDelete={() => hardDeleteService()}
                            onClose={() => setRemoveDialogOpen(false)}
                            open={removeDialogOpen}
                            loading={isSoftDeleteLoading || isHardDeleteLoading}
                        >
                            <Button
                                variant="icon"
                                className="w-10 px-0 shrink-0 rounded-lg border border-primary-500  text-primary-500"
                                onClick={() => setRemoveDialogOpen(true)}
                                title="Remove Service"
                            >
                                <Trash  className="h-4 w-4" />
                            </Button>
                        </RemoveServiceDialog>
                    </div>
                    {/* Provider Avatar */}
                    <div className="absolute bottom-3 left-3">
                        <ProviderAvatar providerId={props.service.providerId} alt={props.service.title} />
                    </div>
                </div>

                {/* Service Details */}
                <div className="p-4">
                    <Badge variant="secondary" className="text-xs mb-2 bg-gray-100 text-gray-700">
                        {props.service.specialtyId}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{props.service.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{props.service.professionId}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Duration: {props.service.duration || "N/A"}</span>
                        <span className="font-medium text-gray-900">
                                            {props.service.price ? `$${props.service.price}` : "Contact for price"}
                                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

}

export default ServiceCard







