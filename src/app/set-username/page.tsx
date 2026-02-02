"use client";

import { setUsernameAction } from "@/src/app/set-username/action";

export default function SetUserNamePage() {
	function handleSubmitUsername(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);

		const username = formData.get("username") as string;

		setUsernameAction(username);
	}

	return (
		<main className='flex items-center justify-center h-screen w-full shrink-0'>
			<div className='w-full max-w-md p-6 bg-white rounded shadow-md mx-auto'>
				<h1 className='text-xl font-bold'>Set Username Page</h1>
				<form
					className='mt-6 flex flex-col gap-4 max-w-xs'
					onSubmit={(event) => handleSubmitUsername(event)}
				>
					<div className='flex flex-col gap-1'>
						<label
							htmlFor='username'
							className='text-sm font-medium'
						>
							What should we call you?
						</label>
						<input
							type='text'
							id='username'
							name='username'
							placeholder='Enter your name'
							className='rounded border border-gray-300 p-2 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
							required
						/>
					</div>
					<button
						type='submit'
						className='rounded bg-blue-600 py-2 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition-colors'
					>
						Save
					</button>
				</form>
			</div>
		</main>
	);
}
