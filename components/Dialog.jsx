import { useState } from "react";
import { useAppContext } from "../utils/AppContext";

const Dialog = {
  DownloadModelAndBinary: ({ error }) => {
    const { modelPathAbs, pathExecAbs } = error;

    return (
      <Dialog.Wrapper
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
      <Dialog.Wrapper
        title="Fail to connect to websocket"
        content={<>
          <p className="my-2 text-white text-lg leading-relaxed">
            Make sure that the process is still running
          </p>
        </>}
      />
    );
  },
  Settings: ({ setShowSettings }) => {
    const { socket, userConfig } = useAppContext();
    const [cfg, setCfg] = useState(JSON.parse(JSON.stringify(userConfig)));
    const dismiss = () => setShowSettings(false);

    const onChange = (key) => (e) => { setCfg(cfg => ({ ...cfg, [key]: e.target.value })) };

    const CONFIGS = [
      'threads',
      'seed',
      'top_k',
      'top_p',
      'n_predict',
      'temp',
      'repeat_penalty',
      'ctx_size',
      'repeat_last_n',
    ];
    const CLASS_DISABLE = "md:w-1/2 border-2 border-gray-800 text-gray-400 rounded p-3 mr-1 cursor-pointer";
    const CLASS_ENABLE = "md:w-1/2 border-2 border-emerald-600 text-gray-200 rounded p-3 mr-1 cursor-pointer";
    const handleSetContextMemory = (enabled) => () => {
      setCfg(cfg => ({ ...cfg, '__context_memory': enabled ? '4' : '0' }));
    };

    return (
      <Dialog.Wrapper
        title="Settings"
        content={<>
          <div className="w-full">
            {CONFIGS.map(key => <FormInput
              key={key}
              label={key}
              value={cfg[key]}
              onChange={onChange(key)}
            />)}
            <FormInput
              label="other params"
              value={cfg['__additional']}
              onChange={onChange('__additional')}
            />
            {cfg['__context_memory'] !== '0' && (
              <FormInput
                label="# of message to memorize"
                value={cfg['__context_memory']}
                onChange={onChange('__context_memory')}
              />
            )}
            <div className="flex mt-5 items-stretch">
              <div className={cfg['__context_memory'] === '0' ? CLASS_ENABLE : CLASS_DISABLE} onClick={handleSetContextMemory(false)}>
                <b>No context memory</b><br />
                <small>The model doesn't care about previous messages</small>
                <div className="h-full"></div>
              </div>
              <div className={cfg['__context_memory'] === '0' ? CLASS_DISABLE : CLASS_ENABLE} onClick={handleSetContextMemory(true)}>
                <b>Context memory</b><br />
                <small>The model remember last N messages. Reponse time will be much slower.</small>
                <div className="h-full"></div>
              </div>
            </div>
          </div>
        </>}
        footer={<>
          <p className="text-gray-400 max-w-xs">
            After saving changes, you will need to <b>manually</b> restart the server.
          </p>

          <button
            className="text-gray-400 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={dismiss}
          >
            Cancel
          </button>
          <button
            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => {
              socket.emit('save_user_config', cfg);
              window.alert('Changes saved. Please manually restart the server.');
              dismiss();
            }}
          >
            Save Changes
          </button>
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
        <div className="relative w-auto my-6 mx-auto max-w-3xl max-h-full">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-800 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-400 bg-gray-800 rounded-t">
              <h3 className="text-2xl font-semibold">
                {title}
              </h3>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              {content}
            </div>
            {/*footer*/}
            {footer && <div className="flex items-center justify-end p-6 border-t border-solid border-gray-400 bg-gray-800 rounded-b">
              {footer}
            </div>}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>;
  },
};

const FormInput = ({ label, value, onChange }) => {
  return <>
    <div className="md:flex md:items-center mb-1">
      <div className="md:w-1/3">
        <label className="block text-gray-400 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor={label}>
          {label}
        </label>
      </div>
      <div className="md:w-2/3">
        <input className="bg-gray-700 appearance-none border-2 border-gray-800 rounded w-full py-2 px-4 text-white leading-tight focus:outline-none focus:border-emerald-600" id={label} type="text" value={value} onChange={onChange} />
      </div>
    </div>
  </>
};

export default Dialog;