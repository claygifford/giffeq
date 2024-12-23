import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { PanelMode, useLayout } from "../../lib/context/layout-context";
import { useConnector } from "../../lib/context/connector-context";

export default function ConnectorPanelComponent() {
  const { connectorPane, changeConnectorPane } = useLayout();
  const { connectors } = useConnector();

  const onClose = () => {
    changeConnectorPane(PanelMode.Collapsed);
  };

  const activeConnectors = connectors.filter((i) => i.status !== "none");
  const inactiveConnectors = connectors.filter((i) => i.status === "none");

  if (connectorPane === PanelMode.Collapsed) return;

  return (
    <div className="flex flex-col basis-80 p-4">
      <div className="flex flex-col flex-1 overflow-y-hidden drop-shadow-xl bg-white rounded border border-neutral-400/50">
        <div
          style={{ borderBottom: "1px solid rgb(204 204 204)" }}
          className="flex items-center border-b-2"
        >
          <div className="text-lg font-medium text-gray-800 px-4 py-2">
            Connectors
          </div>
          <button
            onClick={onClose}
            className="ml-auto group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <XMarkIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] stroke-2 [&>path]:stroke-[2]" />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="py-1 px-2">
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              Active
            </span>
          </div>
          {activeConnectors?.map((s, index) => {
            return (
              <div key={index}>
                <div
                  style={{
                    position: "relative",
                    minHeight: "100px",
                    margin: "20px",
                  }}
                >
                  <Image
                    alt="Login with Spotify"
                    src={s.src}
                    fill
                    sizes="(min-width: 400px) 50vw, 100vw"
                    style={{
                      objectFit: "contain", // cover, contain, none
                    }}
                  />
                </div>
                <div className="px-2 py-1 font-medium text-blue-900">
                  {s.message}
                </div>
              </div>
            );
          })}
          <div className="border-t border-gray-300 py-1 px-2">
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              Inactive
            </span>
          </div>
          {inactiveConnectors?.map((s, index) => {
            return (
              <div key={index}>
                <div
                  style={{
                    position: "relative",
                    minHeight: "100px",
                    margin: "20px",
                  }}
                >
                  <Image
                    alt="Login with Spotify"
                    src={s.src}
                    fill
                    sizes="(min-width: 400px) 50vw, 100vw"
                    style={{
                      objectFit: "contain", // cover, contain, none
                    }}
                  />
                </div>
                <div className="p-4 flex justify-center items-center">
                  <Link href={s.link} passHref legacyBehavior>
                    <a className="group relative flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Login with {s.name}
                    </a>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
