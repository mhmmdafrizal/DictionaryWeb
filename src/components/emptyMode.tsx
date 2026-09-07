import React from "react";

const EmptyMode: React.FC = () => {
    return (
        <section className='w-full flex flex-col items-center justify-center h-56'>
            <h1 className='text-cpurple text-2xl text-center'>Your vocabulary journey starts here</h1>
            <p className='text-emerald-500 text-center'>Enter a word above to explore</p>

        </section>
    )
}
export default EmptyMode;