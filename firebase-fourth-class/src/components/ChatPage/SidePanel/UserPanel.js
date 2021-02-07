import React, { useRef } from 'react'
import { IoMdChatboxes } from 'react-icons/io';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useSelector, useDispatch } from 'react-redux';
import { setPhotoURL } from '../../../redux/actions/user_action';
import mime from 'mime-types';
import firebase from '../../../firebase';

function UserPanel() {

    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();

    const inputOpenImage = useRef();

    const handelLogout = () => {
        firebase.auth().signOut();
    }

    const handleOpenImageRef = () => {
        inputOpenImage.current.click();
    }

    const handleUploadImage = async (event) => {
        const file = event.target.files[0];
        const metadata = {contentType: mime.lookup(file.name)}
        // console.log("file", file)
        // console.log("metadata", metadata)

        try {
            let uploadTaskSnapshot = await firebase.storage().ref()
                .child(`user_image/${user.uid}`)
                .put(file, metadata)

            let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

            // profile image 수정
            await firebase.auth().currentUser.updateProfile({
                photoURL:downloadURL
            })

            dispatch(setPhotoURL(downloadURL));
            // console.log('uploadTaskSnapshot', uploadTaskSnapshot)

            await firebase.database().ref("users")
                .child(user.uid)
                .update({ image: downloadURL })

        } catch (err) {
            alert(err);
        }
    }

    return (
        <div>
            <h3 style ={{ color: 'white' }}>
            <IoMdChatboxes />{" "}
                Chat App
            </h3>

            <div style ={{ display: 'flex', marginBottom: '1rem' }}>
                <Image src={user && user.photoURL} 
                    style = {{ width: '30px', height: '30px', marginTop: '3px' }}
                    roundedCircle />

                <input type="file" 
                       style={{display:"none"}} 
                       ref={inputOpenImage} 
                       accept="image/jpeg, image/png"  
                       onChange={handleUploadImage}
                />

                <Dropdown>
                    <Dropdown.Toggle 
                        style = {{ background:'transparent', border: '0px' }}
                        id="dropdown-basic">
                        {user && user.displayName}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleOpenImageRef}>
                            프로필 사진 변경
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handelLogout}>
                            로그아웃
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

            </div>
        </div>
    )
}

export default UserPanel
