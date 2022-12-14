import { PhoneIcon, MapPinIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const ContactMe = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    window.location.href = `mailto:marnouxmanser@gmail.com?subject=${formData.subject}&body=Hi, my name is ${formData.name}. ${formData.message} ${formData.email}`;
  };

  return (
    <div className="h-screen w-[90vw] flex relative flex-col text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center align-center">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-500 text-2xl">Contact</h3>

      <div className="flex flex-col space-y-5 md:space-y-25 mt-[15vh] sm:mt-[30vh] lg:mt-[-15vh]">
        <h4 className="text-4xl font-semibold text-center">
          I&apos;ve got what you need. &nbsp;
          <span className="underline decoration-[#36b2ed]/40">Let&apos;s Talk.</span>
        </h4>

        <div className="space-y-5 md:space-y-6">
          <div className="flex items-center space-x-5 justify-center">
            <PhoneIcon className="text-[#36b2ed] h-7 w-7 animate-pulse" />

            <p className="text-2xl">+31 61 686 1777</p>
          </div>

          <div className="flex items-center space-x-5 justify-center">
            <EnvelopeIcon className="text-[#36b2ed] h-7 w-7 animate-pulse" />

            <p className="text-2xl">marnouxmanser@gmail.com</p>
          </div>

          <div className="flex items-center space-x-5 justify-center">
            <MapPinIcon className="text-[#36b2ed] h-7 w-7 animate-pulse" />

            <p className="text-2xl">Amsterdam, Netherlands</p>
          </div>
        </div>

        <form
          className="flex flex-col space-y-2 w-fit mx-auto sm:max-w-[50rem] lg:max-w-[90vw]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input {...register('name')} className="contactInput" placeholder="Name " type="text" />
          <input {...register('email')} className="contactInput" placeholder="Email" type="email" />
          <input
            {...register('subject')}
            className="contactInput"
            placeholder="Subject"
            type="text"
          />

          <textarea {...register('message')} className="contactInput" placeholder="Message" />

          <button
            type="submit"
            className="bg-[#36b2ed] py-2 px-3 rounded-md text-black font-bold text-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
