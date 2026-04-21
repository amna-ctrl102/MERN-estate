import { useSelector,useDispatch } from "react-redux";
import {useRef,useState,useEffect} from "react";
import { supabase } from "../supabase";
import { setUser } from "../redux/user/userSlice";

export default function Profile() {
  const fileRef=useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch=useDispatch();

  const [file, setFile]=useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  console.log(file);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  console.log("Current user is : ",currentUser) 

    // Pre-fill form when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
      setAvatarUrl(currentUser.avatar || "");
    }
  }, [currentUser]);

  const handleFileUpload=async(file)=>{
    //FILE UPLOAD TASK
       setFilePerc(5);
       setFilePerc(20);
       setFilePerc(40);
       setFilePerc(50);
      const fileName = `${Date.now()}-${file.name}`;
       const { data, error } = await supabase.storage
        .from('Avatars')
        .upload(fileName, file);
      
      if (error) {
        setFileUploadError(true);
        console.log('Upload error:', error);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from('Avatars')
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData?.publicUrl;
      if (!imageUrl) {
        setFileUploadError(true);
        return;
      }

      setFilePerc(100);
      setAvatarUrl(imageUrl);
      console.log(imageUrl);
  };
  const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        avatar: avatarUrl,
      }),
    });
   

    
    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    

    dispatch(setUser(data));
    alert("Profile updated successfully!");
  } catch (error) {
    console.log(error);
  }
  
};
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-4">Profile</h1>
      <form className="flex flex-col gap-3" onSubmit={handleUpdate}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={async (e) => {
          const selectedFile = e.target.files[0];
          if (selectedFile) {
            setFile(selectedFile);
            await handleFileUpload(selectedFile); // upload immediately
          }
          }}
        />
        <img
          src={avatarUrl ||currentUser?.avatar||"https://static.vecteezy.com/system/resources/previews/046/409/821/non_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg"}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover self-center mt-2 cursor-pointer"
          onClick={()=>fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error uploading image (must be image & less than 5MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          value={username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          type="submit"
        >
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer"> Delete Account</span>
        <span className="text-red-700 cursor-pointer"> Sign Out</span>
      </div>
    </div>
  );
}
