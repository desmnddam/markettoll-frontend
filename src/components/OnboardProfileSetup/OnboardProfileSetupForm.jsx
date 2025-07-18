import React, { useContext, useEffect, useState } from "react";
import ProfilePicture from "./ProfilePicture";
// import AddLocation from "./AddLocationForm";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import ButtonLoader from "../Global/ButtonLoader";

const OnboardProfileSetupForm = () => {
  const [count, setCount] = useState(1);
  const [image, setImage] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [stateFullName, setStateFullName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (image) {
      setLoading(true);
      const formData = new FormData();
      formData.append("profileImage", image);
      try {
        const response = await axios.put(
          `${BASE_URL}/users/profile-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // console.log("Profile Image Updated Successfully:", response.data);
        if (response?.data?.success) {
          fetchUserProfile();
          // setCount(2);
          navigate("/review-profile-image", {
            state: { userData: response?.data?.data },
          });
          return response.data;
        }
      } catch (error) {
        // console.error(
        //   "Error Updating Profile Image:",
        //   error.response ? error.response.data : error.message
        // );
        toast.error("Something went wrong");
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please upload a profile picture before proceeding.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedState || !selectedCity) {
      toast.error("Please select both state and city.");
      return;
    }
    setLoading(true);
    const addressData = {
      streetAddress: "",
      apartment_suite: "",
      country: "United States",
      state: stateFullName,
      city: selectedCity,
      zipCode: "",
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/users/address`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Address Updated Successfully:", response.data);
      if (response?.data?.success) {
        fetchUserProfile();
        toast.success("Address added successfully");
        navigate("/add-service-or-product");
        return response.data;
      }
    } catch (error) {
      console.error(
        "Error Updating Address:",
        error.response ? error.response.data : error.message
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F7F7F7] rounded-[30px] px-4 py-12 relative">
      {count > 1 && (
        <button
          type="button"
          onClick={() => setCount(1)}
          className="text-sm text-[#5C5C5C] font-medium absolute top-5 left-10 flex items-center gap-1"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          Back
        </button>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-3"
      >
        <h2 className="text-[36px] font-bold blue-text">Add Profile Picture</h2>

        <ProfilePicture image={image} setImage={setImage} />

        <div className="mt-3 w-full lg:w-[635px]">
          <button
            type={count > 1 ? "submit" : "button"}
            onClick={count > 1 ? handleSubmit : handleNext}
            className="blue-bg text-white rounded-full font-bold py-3 w-full lg:w-[635px] h-[50px]"
          >
            {count === 1 ? (
              image ? (
                loading ? (
                  <ButtonLoader />
                ) : (
                  "Next"
                )
              ) : (
                "Upload Photo"
              )
            ) : loading ? (
              <ButtonLoader />
            ) : (
              "Add"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardProfileSetupForm;
