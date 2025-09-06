import { TextAlignCenterIcon,  } from "@radix-ui/react-icons"
import {UserCircleIcon} from "@heroicons/react/16/solid";


type ProfileMenuButtonProps = {
  onClick?: () => void
}

const ProfileMenuButton = ({ onClick }: ProfileMenuButtonProps) => {
  return (
    <button >
      <div
        onClick={onClick}
        className="flex cursor-pointer select-none items-center gap-2 rounded-full border border-dark-50 px-3 py-1.5 transition-colors ease-in hover:border-transparent hover:bg-primary-50 active:bg-primary-100"
      >
        <TextAlignCenterIcon className="size-5" />

        <div className="flex items-center justify-center rounded-full bg-primary-500 p-1.5">
          <UserCircleIcon className="size-5 text-white" />
        </div>
      </div>
    </button>
  )
}

export default ProfileMenuButton
