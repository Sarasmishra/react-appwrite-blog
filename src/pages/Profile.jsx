import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess } from "../utils/toast";
import { account } from "../app/appwriteConfig";
import { uploadFile, getFileUrl } from "../app/storageService";



const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setAvatarUploading(true);

    // Upload to SAME bucket
    const fileId = await uploadFile(file);

    // Save avatar fileId in user prefs
    await account.updatePrefs({
      avatarId: fileId,
    });

    showSuccess("Avatar updated successfully");
    window.location.reload(); // simple & safe
  } catch (err) {
    console.error("Avatar upload failed", err);
  } finally {
    setAvatarUploading(false);
  }
};

  if (!user) {
    return <p className="text-center mt-10">Not authenticated</p>;
  }

  const handleUpdateName = async () => {
    try {
      setLoading(true);
      await account.updateName(name);
      showSuccess("Profile updated successfully");
      window.location.reload(); // simple & safe for now
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
  {user.prefs?.avatarId ? (
    <img
      src={getFileUrl(user.prefs.avatarId)}
      alt="avatar"
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
    <AvatarFallback className="text-2xl">
      {user.name?.charAt(0).toUpperCase()}
    </AvatarFallback>
  )}
</Avatar>
<div className="space-y-1">
  <label className="text-sm font-medium">
    Change Avatar
  </label>
  <Input
    type="file"
    accept="image/*"
    disabled={avatarUploading}
    onChange={handleAvatarUpload}
  />
  <p className="text-xs text-muted-foreground">
    JPG / PNG • Max 5MB
  </p>
</div>

            <div>
              <p className="font-medium text-lg">{user.name}</p>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>

            </div>
          </div>

          {/* Editable Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <Button
            onClick={handleUpdateName}
            disabled={loading || name === user.name}
          >
            {loading ? "Saving..." : "Update Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
