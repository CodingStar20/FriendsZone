import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import UserFeed from '../Components/UserFeed/UserFeed'


function Feed({ socket,setShowLikeUserModal,showLikeUserModal  }) {
    const dispatch = useDispatch()
    const [AllUser, setAllUser] = useState([])
    const [suggestionFriends, setSuggestionFriends] = useState([])


    const UserInformationLoad = useSelector((state) => {
        return state.UserInformationLoad.value
    })
    const PostWhichUserSelectedImageORVideo = useSelector((state) => {
        return state.PostWhichUserSelectedImageORVideo
    })





    useEffect(() => {
        socket?.emit("login", localStorage.getItem("uuid"))
        socket?.off("onlineUsers").on('onlineUsers', (data) => {
            dispatch({ type: "onlineUsers", payload: data })
        })
    }, [])

    useEffect(() => {
        async function getAllUser() {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BACKENDURL}/api/v1/all/user`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("uuid")}`
                    }
                })
                const data = await res.json()
                if (res.status === 200) {
                    setAllUser(data)
                }
                else if (res.status !== 200) {
                    console.log("error")
                }
            }
            catch (err) {
                console.warn(err)
            }
        }
        getAllUser()
    }, [])

    useEffect(() => {
        async function isFriends() {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BACKENDURL}/blob/friends/${UserInformationLoad?.googleId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("uuid")}`
                    }
                })
                const data = await res.json()
                if (res.status === 200) {
                    const filterUsers = data.friendList !== null && AllUser.filter((item) => {
                        return data.friendList.some((value) => {
                            return value._id !== item.googleId && item.googleId !== UserInformationLoad?.googleId
                        })

                    })
                    setSuggestionFriends(filterUsers)
                }
                else if (res.status !== 200) {
                    return

                }

            } catch (err) {
                console.warn(err)

            }
        }
        UserInformationLoad?.googleId && isFriends()
    }, [])


    async function FilterUser(id) {
        setAllUser(AllUser.filter(user => user._id !== id))
    }

    return (
        <UserFeed PostWhichUserSelectedImageORVideo={PostWhichUserSelectedImageORVideo} socket={socket} AllUser={suggestionFriends} FilterUser={FilterUser} showLikeUserModal={showLikeUserModal} setShowLikeUserModal={setShowLikeUserModal} />

    )
}

export default Feed