import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState(" ");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${listing.userRef}`,{
          credentials:"include",
        });
        const data = await res.json();
        setLandLord(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandLord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className="font-semibold text-amber-500"> {landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold text-blue-950"> {listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            className="w-full border border-blue-300 rounded-lg p-3 mt-2 bg-gray-50 text-blue-950 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Enter your message here..."
          ></textarea>
          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-blue-950 text-white font-semibold text-center p-3 uppercase rounded-lg hover:opacity-95 hover:shadow-md transition'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}
