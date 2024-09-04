import {useAppDispatch, useAppSelector} from "../app/hooks";
import {USER_IMAGE_URL} from "../app/consts";
import {Form} from "react-final-form";
import { useUpdateProfileMutation, useUpdatePasswordMutation, useUpdatePictureMutation } from "../features/profile/profile_slice";
import MyField from "../components/MyField";
import {useEffect, useState} from "react";
import {setUser} from "../features/authentication/authentication_slice";

export default function Profile() {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const [
        updateProfile,
        {
            isSuccess: isProfileSuccess,
            isLoading: isProfileLoading,
            error: profileError,
            data: profileData,
        }] = useUpdateProfileMutation();

    const [
        updatePassword,
        {
            isSuccess: isPasswordSuccess,
            isLoading: isPasswordLoading,
            error: passwordError,
        }] = useUpdatePasswordMutation();

    const [
        updatePicture,
        {
            isSuccess: isPictureSuccess,
            data: pictureData,
        }] = useUpdatePictureMutation();

    const passwordErrors = passwordError?.data.message.errors;

    const profileErrors = profileError?.data.message.errors;
    const [showProfileSuccess, setShowProfileSuccess] = useState(false);
    const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

    useEffect(() => {
        if(isProfileSuccess) {
            dispatch(setUser(profileData));

            setShowProfileSuccess(true);

            setTimeout(() => {
                setShowProfileSuccess(false);
            }, 5000);
        }
    }, [isProfileSuccess]);

    useEffect(() => {
        if(isPasswordSuccess) {
            setShowPasswordSuccess(true);

            setTimeout(() => {
                setShowPasswordSuccess(false);
            }, 5000);
        }
    }, [isPasswordSuccess]);

    useEffect(() => {
        if(isPictureSuccess) {
            dispatch(setUser(pictureData));
        }
    }, [isPictureSuccess]);

    const [picture, setPicture] = useState(null);
    const [displayPicture, setDisplayPicture] = useState(USER_IMAGE_URL + user.picture);

    useEffect(() => {
        if(picture == null) return setDisplayPicture(USER_IMAGE_URL + user.picture);

        const reader = new FileReader();
        reader.readAsDataURL(picture);
        reader.onload = () => setDisplayPicture(reader.result);

    }, [picture]);


    const uploadPicture = (event) => {
        event.preventDefault();
        updatePicture({picture});
    };

    return (
        <div className="bg-white rounded">
            <div className="divide-y divide-white/5">
                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-800">Personal Information</h2>
                    </div>

                    <div>
                        <div className="col-span-full flex items-center gap-x-8">
                            <img
                                alt=""
                                src={displayPicture}
                                className="h-24 w-24 flex-none rounded-lg bg-gray-100 object-cover"
                            />
                            <div>
                                <form onSubmitCapture={uploadPicture}>
                                    <label className="cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gray-500
                                           rounded-md bg-gray-800 px-3 py-2 text-sm
                                           font-semibold text-white shadow-sm hover:bg-gray-600">
                                        <input onChange={(event) => setPicture(event.target.files[0])}
                                               type="file" name="picture" tabIndex={0}
                                               accept={"image/*"}
                                               className="absolute inset-0 w-0 h-0 opacity-0 cursor-pointer"/>
                                        Change avatar
                                    </label>
                                    <p className="mt-2 text-xs leading-5 text-gray-400">JPG, GIF or PNG.</p>

                                    {displayPicture !== USER_IMAGE_URL + user.picture && (
                                        <button
                                            type="submit"
                                            className="rounded-md mt-2 bg-indigo-50 px-2.5 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                                        >
                                            Save Picture
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>

                        <Form onSubmit={updateProfile} initialValues={user}
                              render={({handleSubmit}) => (
                                  <form onSubmit={handleSubmit} className="md:col-span-2">
                                      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:max-w-xl sm:grid-cols-6 mt-8">
                                          <MyField
                                              label="First Name"
                                              id="firstName"
                                              name="firstName"
                                              type="text"
                                              autoComplete="given-name"
                                              error={profileErrors?.firstName}
                                              className="sm:col-span-3"
                                          />

                                          <MyField
                                              label="Last Name"
                                              id="lastName"
                                              name="lastName"
                                              type="text"
                                              autoComplete="family-name"
                                              error={profileErrors?.lastName}
                                              className="sm:col-span-3"
                                          />

                                          <MyField
                                              label="Email address"
                                              id="email"
                                              name="email"
                                              type="email"
                                              autoComplete="family-name"
                                              error={profileErrors?.email}
                                              className="col-span-full"
                                          />
                                      </div>

                                      {showProfileSuccess && (
                                          <div className="text-green-500 text-sm mt-2">
                                              Profile updated successfully.
                                          </div>
                                      )}

                                      <div className="mt-8 flex">
                                          <button
                                              type="submit"
                                              disabled={isProfileLoading}
                                              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                          >
                                              {isProfileLoading ? "Saving..." : "Save"}
                                          </button>
                                      </div>
                                  </form>
                              )}
                        />
                    </div>



                </div>

                <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                        <h2 className="text-base font-semibold leading-7 text-gray-800">Change password</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-400">
                            Update your password associated with your account.
                        </p>
                    </div>

                    <Form onSubmit={updatePassword} validate={(values) => {
                        const errors = {};

                        if (values.newPassword !== values.confirmPassword) {
                            errors.confirmPassword = "Passwords do not match";
                        }

                        return errors;
                    }} render={({handleSubmit, errors, touched, form}) => (
                        <form onSubmit={async event => {
                            await handleSubmit(event)
                            form.reset()
                        }} className="md:col-span-2">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:max-w-xl sm:grid-cols-6">

                                <MyField
                                    label="Current Password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    autoComplete="current-password"
                                    className="col-span-full"
                                    error={passwordErrors?.currentPassword || (touched.currentPassword && errors.currentPassword)}
                                />

                                <MyField
                                    label="New Password"
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    className="col-span-full"
                                    error={passwordErrors?.newPassword || (touched.newPassword && errors.newPassword)}
                                />


                                <MyField
                                    label="Confirm Password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="confirm-password"
                                    className="col-span-full"
                                    error={passwordErrors?.confirmPassword || (touched.confirmPassword && errors.confirmPassword)}
                                />
                            </div>

                            {showPasswordSuccess && (
                                <div className="text-green-500 text-sm mt-2">
                                    Password updated successfully.
                                </div>
                            )}

                            <div className="mt-8 flex">
                                <button
                                    type="submit"
                                    disabled={isPasswordLoading}
                                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                    {isPasswordLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    )}/>
                </div>
            </div>
        </div>
    );
}