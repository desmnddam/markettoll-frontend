import React, { useContext, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Loader from "../../components/Global/Loader";

const SettingsDeactivateListingPage = () => {
  const [deactivated, setDeactivated] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [listingCount, setListingCount] = useState("");
  const { user, fetchUserProfile, userProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);

  const fetchListingCount = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/users/listings-visible-count`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // console.log("listing count >>>", res?.data);
      setListingCount(res?.data?.data);
    } catch (error) {
      console.log("listing count err >>>", error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingCount();
  }, []);

  const handleDeactivation = async () => {
    const url =
      userProfile?.status === "active"
        ? `${BASE_URL}/users/deactivate`
        : `${BASE_URL}/users/activate`;
    try {
      setActivating(true);
      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("activation res >>>", res);
      if (res?.status == 201) {
        fetchListingCount();
        fetchUserProfile();
        setDeactivated(!deactivated);
        if (deactivated) {
          setIsDeactivated(!isDeactivated);
        }
      }
    } catch (error) {
      console.log("activation error >>", error?.response?.data?.message);
    } finally {
      setActivating(false);
    }
  };

  const handleCloseModal = () => {
    setDeactivated(!deactivated);
  };

  // if (loading) {
  //   return <Loader />;
  // }

  return (
    <div className="w-full px-5">
      <h2 className="font-bold text-[28px] blue-text">Deactivate Listing</h2>
      <div className="w-full border mt-5 mb-4" />

      <div className="w-full bg-[#F5F5F5] rounded-xl p-5">
        <h3 className="blue-text font-bold text-[28px]">{listingCount}</h3>
        <p className="text-sm mt-2">Total Active Listings</p>
      </div>

      <div className="w-full mt-3">
        <h4 className="text-base font-semibold">Note</h4>
        <p className="text-sm text-[#0E1014] mt-2 mb-4">
          If you deactivate your listing, it will no longer be visible to
          customers, and you will not receive any orders or inquiries for this
          product.
        </p>

        <div>
          <button
            type="button"
            onClick={handleDeactivation}
            className={`${
              userProfile?.status == "active" ? "blue-bg" : "bg-[#FF3B30]"
            } font-bold text-white py-3 w-full rounded-2xl`}
          >
            {userProfile?.status === "active" ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      <DeactivationModal
        showModal={deactivated}
        onclose={handleCloseModal}
        isDeactivated={isDeactivated}
      />
    </div>
  );
};

export default SettingsDeactivateListingPage;

const DeactivationModal = ({ showModal, onclose, isDeactivated }) => {
  return (
    showModal && (
      <div className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div className="bg-white w-full lg:w-[440px] h-[209px] p-7 relative rounded-[20px] flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={onclose}
            className="bg-gray-200 w-6 h-6 rounded-full p-1 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="rounded-full blue-bg h-[69px] w-[69px] p-3">
            <FaCheck className="text-white w-full h-full" />
          </div>
          <span className="text-[#000000]">
            Your listings have successfully{" "}
            {isDeactivated ? "activated" : "deactivated"}
          </span>
        </div>
      </div>
    )
  );
};
