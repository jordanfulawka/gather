'use client';

export default function JoinRoomModal({ onClose, onRoomJoined }) {
  return (
    <div
      className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-[#1A1A2E] border border-[#2D2D44] rounded-lg p-6 w-96'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-[#F8FAFC] text-lg font-semibold mb-4'>
          Join a Room
        </h2>

        <form className='space-y-3'>
          <input
            type='text'
            placeholder='Enter invite code'
            required
            className='w-full px-3 py-2 bg-[#0F0F1A] border border-[#2D2D44] rounded-md text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#7C3AED]'
          />
          <div className='flex gap-2 justify-end pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border border-[#2D2D44] text-[#94A3B8] hover:text-[#F8FAFC] rounded-md text-sm transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-[#F8FAFC] rounded-md text-sm font-medium transition-colors'
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
