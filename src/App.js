import logo from "./logo.svg";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import Modal from "./Modal";
import { FaDownload, FaSearch } from "react-icons/fa";

// let baseurl = "https://4f7d-122-168-12-186.in.ngrok.io";
// let baseurl="http://localhost:5002"
let baseurl = "https://music-on-fire.vercel.app";

function App() {
  const [query, setquery] = useState("second");
  const [users, setusers] = useState([]);
  const [loading, setloading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedUser, setselectedUser] = useState({ name: "", image: "" });
  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });
  const handleChange = (e) => {
    instaSearch(e.target.value);
  };
  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 1000);
  }, []);

  const instaSearch = async (input) => {
    try {
      let headersList = {
        "x-ig-app-id": "936619743392459",
      };

      let response = await fetch(
        `${baseurl}/v1/getInstaSearch?query=${input}`,
        {
          headers: headersList,
        }
      );

      let data = await response.json();
      console.log(data.data.users);
      setusers(data?.data?.users);
    } catch (error) {
      console.log("err", error);
    }
  };

  const getProfile = async (uname) => {
    try {
      let headersList = {
        "x-ig-app-id": "936619743392459",
      };

      let response = await fetch(
        `${baseurl}/api/v1/getProfile?uname=${uname}`,
        {
          method: "GET",
          headers: headersList,
        }
      );

      let data = await response.json();
      setselectedUser({ ...selectedUser, name: uname });
      upScale(data.data.data.user.profile_pic_url_hd);
    } catch (error) {
      console.log("err", error);
    }
  };

  const upScale = async (image) => {
    setloading(true);
    let bodyContent = JSON.stringify({ image: image });
    let headersList = {
      "Content-Type": "application/json",
    };
    let response = await fetch(`${baseurl}/api/v1/getProfile/upScale`, {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });
    let data = await response.json();
    console.log(data.data.urls.get);

    setTimeout(() => {
      getUpscaledImage(data.data.urls.get);
    }, 5000);
  };

  const getUpscaledImage = async (getUrl) => {
    let headersList = {
      "Content-Type": "application/json",
    };
    let response = await fetch(
      `${baseurl}/api/v1/getProfile/getUrl?url=${getUrl}`
    );
    let data = await response.json();
    console.log(data);
    setShow(true);
    setselectedUser({ ...selectedUser, image: data.data });
    setloading(false);

    console.log("response", data.data);
  };

  return (
    <>
      {loading && <div class="loading">Loading&#8230;</div>}

      <>
        {/* <div class="container">
            <input
              type="text"
              placeholder="Search..."
              onChange={debouncedResults}
              onE
            />
            <div class="search"></div>
          </div> */}

        {selectedUser.image ? (
          <div class="searchBox1" onClick={() => setselectedUser({})}>
            <button
              class="searchButton1"
              onClick={() => window.open(selectedUser.image, "_blank")}
            >
              <FaDownload />
            </button>
          </div>
        ) : (
          <div class="searchBox">
            <input
              class="searchInput"
              type="text"
              name=""
              placeholder="Search"
              onChange={(q) => setquery(q.target.value)}
            />
            <button class="searchButton" onClick={() => instaSearch(query)}>
              <FaSearch />
            </button>
          </div>
        )}
        <div class="list-wrapper">
          <ul class="list">
            {users?.map((user) => {
              return (
                <li
                  class="list-item"
                  onClick={() => getProfile(user.user.username)}
                >
                  <div>
                    <img
                      src={user?.user?.profile_pic_url}
                      class="list-item-image"
                    />
                  </div>
                  <div class="list-item-content">
                    <h4>{user?.user?.full_name}</h4>
                    <p>{user?.user?.username}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </>

      {/* <Modal show={!show} selectedUser={selectedUser} setShow={setShow} /> */}
    </>
  );
}

export default App;
