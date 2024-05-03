import React from 'react';
import Header from "@/components/common/header";
import BackgroundRemoval from "@/components/tools/remover";

const Main = () => {
    return (
        <div>


            <div className="area">
                <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>


            <section>
                <div className="flex items-center justify-center p-10">
                    <div className="text-2xl">
                        <h1 className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 font-bold">
                            Remove Background for <span className="text-yellow-400">Free </span>
                        </h1>
                    </div>
                </div>
            </section>

            <BackgroundRemoval/>

        </div>
    );
};

export default Main;