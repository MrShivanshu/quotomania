"use client";
import "../styles/profile.css";
import Quotes from "@/Components/Quotes";
import Loading from "../Components/Loading";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MainProfile({ data, section, setData, user, loading }) {
  // States
  const [UserInfo, setUserInfo] = useState({
    followers: [],
    followings: [],
  });
  const [toggleBtmNav, setToggleBtmNav] = useState(true)

  // Ref
  const profileNavRef = useRef();
  const bottomDivRef = useRef();

  // Hooks
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  //
  const handleToggleBottomInfo = ()=>{
    setToggleBtmNav(!toggleBtmNav)
  }
  // Use Effect
  useEffect(() => {
    if (status === "authenticated" || localStorage.getItem("authToken")) {
      setUserInfo({ followers: user.followers, followings: user.followings });
    } else if (
      status === "unauthenticated" ||
      localStorage.getItem("authToken")
    ) {
      router.push("/");
    }
    // Profile navigation
    profileNavRef.current.addEventListener("click", (e) => {
      const button = e.target.closest("div");
      if (!button) return;
      const calcLeft = button.offsetLeft;
      if (calcLeft < 164) {
        profileNavRef.current.style.setProperty("--left", calcLeft + "px");
      }
      const calcWidth = button.offsetWidth / profileNavRef.current.offsetWidth;
      if (calcWidth < 1) {
        profileNavRef.current.style.setProperty("--width", calcWidth);
      }
    });
  }, [status, user.followers]);

  // Loading
  if (status === "loading" || loading) {
    // Show a loading state while waiting for user data to load.
    return <Loading />;
  }
  return (
    <>
      <div className="w-5/6 h-full text-white flex flex-col justify-center items-center gap-2">
        <div className="sm:hidden fixed  bottom-0 left-0 w-screen h-2/3 px-4 overflow-hidden z-10" >
          <div className={`relative z-50 w-full h-full ${toggleBtmNav ? "opacity-0 translate-y-full" : "opacity-100"} bg-gray-600 rounded-t-3xl box-border overflow-hidden`} ref={bottomDivRef} style={{transition:".2s"}}>
            <div className="w-full h-8 flex items-center justify-center">
              <div className="bg-white w-1/4 h-1 rounded-full"></div>
            </div>
            <div className="h-full pb-4 w-full bg-gray-600 flex flex-col justify-around relative z-50">
              {[1, 2, 3, 4, 5, 6,7].map((item) => {
                return (
                  <div
                    className="w-full flex items-center justify-start px-6 gap-4 text-2xl"
                    key={item}
                  >
                    <i className="fa-solid fa-gear text-white"></i>
                    <Link href="/setting">Setting</Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* mobile navigation */}
        <div className="w-full h-14 sm:hidden block">
          <div className="w-full h-14 fixed bg-black sm:hidden border-b-2 border-gray-800 top-0 left-0">
            <div className="flex items-center justify-between w-full px-8 h-full">
              <div>{user.username}</div>
              <div onClick={handleToggleBottomInfo}>
                <i className="fa-solid fa-bars text-white"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="h-fit border-b-2 border-l-indigo-700 w-full flex flex-col sm:flex-row gap-4 justify-evenly pt-8 sm:pb-10 border-gray-700">
          <div className="flex gap-6 items-center justify-start w-fit">
            {/* common image for mobile & desktop */}
            <div className="border-2 rounded-full border-gray-500 p-1 w-fit ">
              <img
                src={user.image}
                alt="d"
                className="sm:h-40 sm:w-40 h-14 w-14 rounded-full object-cover"
              />
            </div>
            {/* For Mobile Profile */}
            <div className="block sm:hidden">
              <div className="flex gap-8">
                <div>@{user.username}</div>
                {pathname === "/profile" ? (
                  <i
                    className="fa-solid fa-pen-to-square cursor-pointer"
                    onClick={() => {
                      router.push("/setting");
                    }}
                  ></i>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex sm:gap-8 gap-4">
                <div>{data.length} quote</div>
                <div>0 Followers</div>
                <div>0 Followings</div>
              </div>
            </div>
          </div>
          {/* For Desktop Profile */}
          <div className="flex flex-col gap-4 w-1/2">
            <div className="hidden sm:flex items-center justify-between h-6">
              <div className="flex items-center justify-center">
                <div>@{user.username}</div>
                {pathname === "/profile" ? (
                  <i
                    className="fa-solid fa-pen-to-square cursor-pointer hover:scale-110 ml-8 transition-all"
                    onClick={() => {
                      router.push("/setting");
                    }}
                  ></i>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="hidden gap-8 sm:flex">
              <div>{data.length} quote</div>
              <div>
                {UserInfo.followers && UserInfo.followers.length} Followers
              </div>
              <div>
                {UserInfo.followers && UserInfo.followings.length} Followings
              </div>
            </div>
            <div>
              <strong>
                {user.given_name} {user.family_name}
              </strong>
              <p className="w-full h-24 overflow-auto bg-transparent">
                {user.about || "Nothing here 😔"}
              </p>
            </div>
          </div>
        </div>
        <div
          id="profile-navigation"
          className="flex gap-8 w-fit items-center justify-center"
          ref={profileNavRef}
        >
          {pathname === "/profile" ? (
            <>
              <div>Quotes</div>
              <div>Saved</div>
              <div>Discard</div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="w-full mb-10">
          <div className="">
            <Quotes posts={data} section={section} setData={setData} />
          </div>
        </div>
      </div>
    </>
  );
}
