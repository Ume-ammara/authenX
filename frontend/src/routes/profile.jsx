import React, { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchUser, logoutUser, updateAvatar } from "@/redux/features/authThunks";
import { Camera, Edit } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const fileInputRef = useRef()

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(updateAvatar(file));
    }
  };

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-[#C67B5B]">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-400">
        Failed to load user profile
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#0F0F0F] text-[#FCE7C8] p-6">
      <Card className="w-full max-w-3xl bg-[#181818] border border-[#C67B5B]/40 shadow-[0_0_15px_rgba(198,123,91,0.15)] p-4 sm:p-6 rounded-2xl">

        {/* Header Section */}
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6 border-b border-[#C67B5B]/20 pb-6">
          <div
            onClick={handleAvatarClick}
            className="relative cursor-pointer group"
          >
            <Avatar className="w-28 h-28 border shadow">
              <AvatarImage src={user.avatar} alt={user.fullname} />
              <AvatarFallback>{user.fullname?.[0] ?? "U"}</AvatarFallback>
            </Avatar>

            {/* Upload Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition">
              <Camera className="text-white w-6 h-6" />
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl text-[#C67B5B] font-semibold">
              {user.fullname}
            </CardTitle>
            <p className="text-sm text-[#E5B7A3]/80">
              @{user.username || "username_not_set"}
            </p>
            <p className="text-sm mt-2 text-[#E5B7A3]/70 max-w-md">
              {user.bio || "No bio available."}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="md:ml-auto border-[#C67B5B]/50 text-[#C67B5B] hover:bg-[#C67B5B] hover:text-[#0F0F0F]"
          // onClick={() => navigate({ to: "/admin/edit-profile" })}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>

        {/* Info Section */}
        <CardContent className="pt-6 space-y-6 text-[#FCE7C8]/90">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoItem label="Full Name" value={user.fullname} />
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Role" value={user.role} />
            <InfoItem label="Verified" value={user.isVerified ? "Yes" : "No"} />
            <InfoItem
              label="Created At"
              value={formatDate(user.createdAt)}
            />
            <InfoItem
              label="Updated At"
              value={formatDate(user.updatedAt)}
            />
          </div>

          {/* Divider + Footer */}
          <div className="pt-4 border-t border-[#C67B5B]/20 text-sm">
            <Button
              className="bg-[#C67B5B] text-[#0F0F0F] hover:bg-[#A86244]"
              size="sm"
              onClick={() => {
                dispatch(logoutUser()).then(() => {
                  navigate({ to: "/auth/login" });
                });
              }}
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col bg-[#101010] border border-[#C67B5B]/20 rounded-lg p-3 hover:border-[#C67B5B]/40 transition">
      <span className="text-xs text-[#E5B7A3]/70 uppercase tracking-wide mb-1">
        {label}
      </span>
      <span className="font-medium text-[#FCE7C8] break-words">
        {value || "—"}
      </span>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
