import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createFileRoute } from "@tanstack/react-router"
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { fetchUser } from "@/redux/features/userThunks"
import { Badge } from "lucide-react"

export const Route = createFileRoute("/admin/profile")({
  component: RouteComponent,
})

function RouteComponent() {
  const dispatch = useAppDispatch()
  const { user, isLoading } = useAppSelector((state) => state.auth)


  const [formData, setFormData] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  console.log("user", user)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-400">
        Loading profile...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-500">
        Failed to load user profile
      </div>
    )
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] text-[#FCE7C8] p-6">
      <div className="w-full max-w-lg bg-[#181818] border border-[#C67B5B]/30 rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-[#C67B5B] mb-1">
            My Profile
          </h1>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#C67B5B] text-[#0F0F0F] flex items-center justify-center text-3xl font-bold">
            {user.fullname?.[0]?.toUpperCase() || "U"}
          </div>
          <h2 className="mt-3 text-xl font-semibold">{user.fullname}</h2>
          <p className="text-[#E5B7A3] text-sm">
            {user.role === "ADMIN" ? "Administrator" : "User"}
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs mb-1 text-[#FCE7C8]">
              Full Name
            </label>
            <Input
              value={user.fullname}
              disabled
              className="bg-[#181818] border-[#C67B5B]/30 text-[#FCE7C8] placeholder-[#E5B7A3]/50 focus:border-[#C67B5B]"
            />

          </div>

          <div>
            <label className="block text-xs mb-1 text-[#FCE7C8]">Email</label>
            <Input
              value={user.email}
              disabled
              className="bg-[#181818] border-[#C67B5B]/30 text-[#FCE7C8] placeholder-[#E5B7A3]/50 focus:border-[#C67B5B]"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-[#FCE7C8]">Username</label>
            <Input
              value={user.username || "Not set"}
              disabled
              className="bg-[#181818] border-[#C67B5B]/30 text-[#FCE7C8] placeholder-[#E5B7A3]/50 focus:border-[#C67B5B]"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-[#FCE7C8]">Verified</label>
            <Input
              value={user.isVerified ? "Yes" : "No"}
              disabled
              className={`bg-[#181818] border-[#C67B5B]/30 text-[#FCE7C8] ${user.isVerified
                ? "focus:border-green-500 text-green-400"
                : "focus:border-red-500 text-red-400"
                }`}
            />
          </div>

          <div className="flex justify-between text-xs text-[#E5B7A3] mt-2">
            <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <Button className="bg-transparent border border-[#C67B5B]/40 text-[#FCE7C8] hover:bg-[#C67B5B]/20">
            Edit Profile
          </Button>
          <Button className="bg-[#C67B5B] text-[#0F0F0F] hover:bg-[#A86244]">
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProfileField({ label, value }) {
  return (
    <div className="p-3 border border-border rounded-lg bg-secondary/40 flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">
        {value || "—"}
      </span>
    </div>
  )
}
