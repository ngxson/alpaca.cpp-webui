const DialogGuide = {
  DownloadModelAndBinary: ({ error }) => {
    const { modelPathAbs, pathExecAbs } = error;

    return (
      <DialogGuide.Wrapper
        title="Model or executable file is missing"
        content={<>
          <p className="my-2 text-white text-lg leading-relaxed">
            Cannot find ggml model file or executable file under <span className="font-mono">{'{YOUR_PROJECT_DIRECTORY}/bin'}</span><br />
            <br />
            Please follow this guide to download the model:<br />
            <a className="underline" href="https://github.com/ngxson/alpaca.cpp-webui#how-to-use">https://github.com/ngxson/alpaca.cpp-webui#how-to-use</a><br />
            <br />
            Then, make sure that these paths exist:<br />
            <span className="font-mono">{pathExecAbs}</span><br />
            <span className="font-mono">{modelPathAbs}</span><br />
          </p>
        </>}
      />
    );
  },
  ErrorCannotConnectWS: () => {
    return (
      <DialogGuide.Wrapper
        title="Fail to connect to websocket"
        content={<>
          <p className="my-2 text-white text-lg leading-relaxed">
            Make sure that the process is still running
          </p>
        </>}
      />
    );
  },
  Wrapper: ({ title, content, footer }) => {
    return <>
      <div
        className="fixed w-full h-full bg-black bg-opacity-50"
        style={{ zIndex: 900 }}
      ></div>

      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 outline-none focus:outline-none"
        style={{ zIndex: 1000 }}
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-800 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid bg-gray-800 rounded-t">
              <h3 className="text-2xl font-semibold">
                {title}
              </h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              {content}
            </div>
            {/*footer*/}
            {footer && <div className="flex items-center justify-end p-6 border-t border-solid bg-gray-800 rounded-b">
              {/* <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Save Changes
              </button> */}
              {footer}
            </div>}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>;
  },
};

export default DialogGuide;