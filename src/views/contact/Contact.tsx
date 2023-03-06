const Contact = () => {
  return (
    <div
      id="contact"
      className="w-full h-screen flex justify-center items-center bg-[#0a192f]"
    >
      <form
        action="https://getform.io/f/a1abc966-f58e-404a-b275-3d9364c34c6e"
        method="POST"
        className="flex flex-col max-w-[600px]"
      >
        <div className="pb-8">
          <p className="text-4xl font-bold border-b-4 border-pink-600 inline text-white">
            Contact
          </p>
          <p className="text-gray-300 py-4">
            // Submit the form below or shoot me an mail - npv12@iitbbs.ac.in
          </p>
        </div>
        <input
          className="focus:outline-none p-2 bg-[#ccd6f6]"
          type="text"
          placeholder="Name"
          name="name"
        />
        <input
          className="focus:outline-none my-4 p-2 bg-[#ccd6f6]"
          type="email"
          placeholder="email"
          name="name"
        />
        <textarea
          className="focus:outline-none bg-[#ccd6f6] p-2"
          name="message"
          placeholder="Your message here"
          rows={4}
        ></textarea>
        <div className="text-white flex my-5 gap-x-8 border-b pb-5">
          <label className="flex gap-x-1" htmlFor="male">
            Male
            <input type="radio" name="gender" id="male" value="male" />
          </label>
          <label className="flex gap-x-1" htmlFor="female">
            Female
            <input type="radio" name="gender" id="female" value="female" />
          </label>
          <label className="flex gap-x-1" htmlFor="others">
            Others
            <input type="radio" name="gender" id="others" value="others" />
          </label>
        </div>
        <button className="focus:outline-none text-white border-2 my-8 px-5 py-3 flex items-center justify-center mx-auto hover:bg-pink-600 hover:border-pink-600">
          Let's collborate
        </button>
      </form>
    </div>
  );
};

export default Contact;
