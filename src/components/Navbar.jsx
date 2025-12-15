import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/auth/authThunks";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { getFileUrl } from "../app/storageService";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Sun, Moon, Palette, Menu } from "lucide-react";
import { toggleMode, setColorTheme, getThemeState } from "../utils/theme";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState(getThemeState().mode);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="border-b bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-semibold hover:text-primary transition"
        >
          BlogPlatform
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          {/* ================= DESKTOP ================= */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <Link to="/create">
                <Button>Create</Button>
              </Link>
            )}

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode(toggleMode())}
            >
              {mode === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Color picker */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setColorTheme("blue")}>
                  🔵 Blue
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorTheme("green")}>
                  🟢 Green
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setColorTheme("purple")}>
                  🟣 Purple
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 rounded-full">
                    <Avatar className="h-8 w-8">
                      {user.prefs?.avatarId ? (
                        <img
                          src={getFileUrl(user.prefs.avatarId)}
                          alt="avatar"
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <AvatarFallback>
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/my-posts")}>
                    My Posts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/bookmarks")}>
                    Bookmarks
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate("/create")}>
                    Create Post
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>

          {/* ================= MOBILE ================= */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="top"
                className="pt-10 pb-6 space-y-6 animate-in slide-in-from-top-2"
              >
                <div className="flex flex-col gap-6">
                  {/* USER INFO */}
                  {user && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {user.prefs?.avatarId ? (
                          <img
                            src={getFileUrl(user.prefs.avatarId)}
                            alt="avatar"
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback>
                            {user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="flex flex-col text-sm">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* NAV ACTIONS */}
                  <div className="space-y-2">
                    {user ? (
                      <>
                        <Link to="/create">
                          <Button className="w-full">Create</Button>
                        </Link>

                        <Link to="/my-posts">
                          <Button variant="outline" className="w-full">
                            My Posts
                          </Button>
                        </Link>

                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Link to="/login">
                        <Button className="w-full">Login</Button>
                      </Link>
                    )}
                  </div>

                  {/* THEME CONTROLS */}
                  <div className="flex items-center justify-between border-t pt-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMode(toggleMode())}
                    >
                      {mode === "dark" ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setColorTheme("blue")}
                      >
                        🔵
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setColorTheme("green")}
                      >
                        🟢
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setColorTheme("purple")}
                      >
                        🟣
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
