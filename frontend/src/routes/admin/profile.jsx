import React, { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchUser } from "@/redux/features/authThunks";
import { Edit } from "lucide-react";

export const Route = createFileRoute("/admin/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

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
          <Avatar className="w-24 h-24 shadow-md border border-[#C67B5B]/30">
            <AvatarImage src={user.avatar || ""} alt={user.fullname} />
            <AvatarFallback className="bg-[#C67B5B] text-[#0F0F0F] text-2xl font-bold">
              {user.fullname?.charAt(0) ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl text-[#C67B5B] font-semibold">
              {user.fullname}
            </CardTitle>
            {/* <p className="text-sm text-[#E5B7A3]/80">
              @{user.username || "username_not_set"}
            </p>
            <p className="text-sm mt-2 text-[#E5B7A3]/70 max-w-md">
              {user.bio || "No bio available."}
            </p> */}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="md:ml-auto border-[#C67B5B]/50 text-[#C67B5B] hover:bg-[#C67B5B] hover:text-[#0F0F0F]"
            onClick={() => navigate({ to: "/admin/edit-profile" })}
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
            <p className="font-medium text-[#C67B5B] mb-2">Account Actions</p>
            <Button
              className="bg-[#C67B5B] text-[#0F0F0F] hover:bg-[#A86244]"
              size="sm"
              onClick={() => navigate({ to: "/logout" })}
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
