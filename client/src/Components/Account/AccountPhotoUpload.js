import React, { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';
import Modal from 'react-modal';
import { use } from 'passport';



const AccountPhotoUpload = (props) => {
  const [fileState, setFileState] = useState({
    file: '',
    location: 'https://via.placeholder.com/150',
  });

  const [formState, setFormState] = useState({
    title: '',
    price: '0.99',
    description: '',
    tags: '',
  });
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] =useState("File upload failed")
  const [saveButtonState, setSaveButtonState] = useState("")

  

  useEffect(() => {
    axios.get('/api/getalltags').then((res) => {
      setTags(res.data);
    });
  }, []);

  function handleFile(event) {
    const file = event.target.files[0];
    const location = URL.createObjectURL(event.target.files[0]);

    console.log(event.target.files[0]);
    setFileState({ file: file, location: location });
  }

  function handleForm(event) {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  }

  function handleTagChange(newValue, actionMeta) {
    if (
      actionMeta.action === 'create-option' ||
      actionMeta.action === 'select-option'
    ) {
      setSelectedTags([...selectedTags, newValue[newValue.length - 1]]);
    }
  }

  function handleClick(event) {
    event.preventDefault();
    setSaveButtonState("hidden")
    console.log(fileState)
    if(fileState.location !== 'https://via.placeholder.com/150'){
    const formData = new FormData();
    formData.append('image', fileState.file);
    selectedTags.forEach(async (obj) => {
      if (obj.__isNew__) {
        obj.tagName = obj.label;
        await axios.post('/api/addtag', obj).then((res) => {
          obj._id = res.data._id;
        });
      } else {
        obj._id = obj.value;
      }
    });

    axios.post('/api/files', formData).then((res) =>
      axios
        .post('/api/image', {
          location: res.data.location,
          title: formState.title,
          description: formState.description,
          free: 0,
          price: formState.price,
          tags: selectedTags,
        })
        .then((res) => {
          if(res.data.message === "Image added"){
          console.log("res", res.data.message)
          setModalContent(res.data.message)
          setShowModal(true);
        }
          
        })
    );}else{
      setModalContent("Upload failed")
      setShowModal(true);
    }
  }

  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

  function handleClose(event) {
    event.preventDefault();
    setShowModal(false);
    setFormState({ title: '', price: '0.99', description: '', tags: '' });
    setFileState({
      file: '',
      location: 'https://via.placeholder.com/150',
    });
    setSelectedTags([null])
    setSelectedTags([])
    setSaveButtonState("")
  }

  return (
    <>
      <div
        className={`col-span-12 laptop:border-solid laptop:border-l laptop:border-black laptop:border-opacity-25 h-full pb-12 laptop:col-span-10 ${props.hidden}`}
      >
        <div className="px-4 pt-4">
          <form
            action="#"
            className="flex flex-col space-y-8"
            onSubmit={handleClick}
          >
            <div>
              <h3 className="text-2xl font-semibold">Add Photo</h3>
              <hr />
            </div>
            <div className="text-lg font-thin text-white   flex ">
              <label className="w-64 flex flex-col font-bold items-center px-4 py-6 bg-pixi text-black rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-cardColor hover:text-gray-200">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-base leading-normal">
                  Select an image
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFile}
                  accept="image/*"
                />
              </label>
              <img
                src={fileState.location}
                alt="user uploaded file"
                className="ml-10 max-h-40 max-w-40"
              ></img>
            </div>
            <div className="form-item">
              <label className="text-xl ">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Photo Title"
                className="w-full appearance-none text-black text-opacity-50 rounded shadow py-1 px-2  mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200"
                value={formState.title}
                // defaultValue=""
                onChange={handleForm}
              />
            </div>

            <div className="form-item w-full">
              <label className="text-xl ">Description</label>
              <textarea
                name="description"
                value={formState.description}
                // defaultValue=""
                onChange={handleForm}
                cols="30"
                rows="10"
                className="w-full appearance-none text-black text-opacity-50 rounded shadow py-1 px-2 mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200 text-opacity-25 "
                placeholder="Write a description here"
              ></textarea>
            </div>
            <div className="flex flex-col space-y-4 laptop:space-y-0 laptop:flex-row laptop:space-x-4">
              <div className="form-item w-full">
                <label className="text-xl ">Tags</label>
                <CreatableSelect
                  isClearable
                  onChange={handleTagChange}
                  options={tags}
                  isMulti
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4 laptop:space-y-0 laptop:flex-row laptop:space-x-4">
              <div className="form-item w-full">
                <label className="text-xl ">List Price</label>
                <input
                  name="price"
                  value={formState.price}
                  // defaultValue=""
                  onChange={handleForm}
                  type="text"
                  placeholder="$0.99"
                  className="w-full appearance-none text-black text-opacity-50 rounded shadow py-1 px-2 mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200 text-opacity-25 "
                />
              </div>
            </div>
            <div className="text-lg font-thin text-white   flex mx-auto">
              <button className={saveButtonState}>
                <div className=" bg-buttonColor rounded-xl shadow-xl text-center  px-3 py-1">
                  Save
                </div>
              </button>
              <Modal isOpen={showModal} style={customStyles}>
                <div className="content-center">
                <h1 className="content-center">{modalContent}</h1>
                <button
              className="flex flex-col font-bold items-center p-1 mt-2 bg-buttonColor  rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-cardColor text-gray-200" onClick={handleClose} >Close</button>
                </div>
              </Modal>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountPhotoUpload;
