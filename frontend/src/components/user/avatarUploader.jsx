import { updateAvatar } from "@/redux/features/authThunks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRef } from "react";


export default function AvatarUploader() {
    const dispatch = useAppDispatch();
    const { user, isLoading } = useAppSelector((state) => state.auth);
    const fileInputRef = useRef()

     const handleAvatarClick = () => {
    fileInputRef.current?.click(); // open file dialog
  };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            dispatch(updateAvatar(file));
        }
    };

    return (
        <div className="flex flex-col items-center">
            
            <img
                src={user?.avatarUrl || "/default-avatar.png"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border"
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-3"
                disabled={isLoading}
            />
        </div>
    );
}
