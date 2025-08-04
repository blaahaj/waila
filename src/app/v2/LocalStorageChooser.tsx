import * as React from "react";

import { Button } from "@zendeskgarden/react-buttons";
import { Notification } from "@zendeskgarden/react-notifications";
import { Table } from "@zendeskgarden/react-tables";
import { useEffect, useState } from "react";

const LocalStorageChooser = ({
  setImageSource,
  reloadList,
}: {
  setImageSource: React.Dispatch<React.SetStateAction<string | undefined>>;
  reloadList: () => void;
}) => {
  const [localFiles, setLocalFiles] = useState<File[]>();

  useEffect(
    () =>
      void navigator.storage
        .getDirectory()
        .then(async (dir) => {
          const m: File[] = [];

          for await (const [name] of dir.entries()) {
            const file = await dir.getFileHandle(name).then((h) => h.getFile());
            m.push(file);
          }

          return m;
        })
        .then((entries) => setLocalFiles(entries))
        .catch((err) => console.error(err)),
    []
  );

  return (
    <div>
      {localFiles && localFiles.length > 0 ? (
        <Table style={{ width: "auto" }}>
          <Table.Head>
            <Table.HeaderRow>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Size</Table.HeaderCell>
              <Table.HeaderCell>Modified</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
            </Table.HeaderRow>
          </Table.Head>
          <Table.Body>
            {localFiles
              .toSorted((a, b) => a.name.localeCompare(b.name))
              .map((file) => (
                <Table.Row
                  key={file.name}
                  style={{ verticalAlign: "baseline" }}
                >
                  <Table.Cell style={{ marginBlockEnd: "2em" }}>
                    {file.type.startsWith("image/") ? (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setImageSource(URL.createObjectURL(file));
                        }}
                      >
                        {file.name}
                      </a>
                    ) : (
                      file.name
                    )}
                  </Table.Cell>
                  <Table.Cell style={{ marginBlockEnd: "2em" }}>
                    {file.size}
                  </Table.Cell>
                  <Table.Cell style={{ marginBlockEnd: "2em" }}>
                    {new Date(file.lastModified).toISOString()}
                  </Table.Cell>
                  <Table.Cell style={{ width: "auto" }}>{file.type}</Table.Cell>
                  <Table.Cell style={{ marginBlockEnd: "2em" }}>
                    <Button
                      isDanger={true}
                      onClick={() =>
                        navigator.storage
                          .getDirectory()
                          .then((dir) =>
                            dir.removeEntry(file.name).then(() => reloadList())
                          )
                      }
                      title="Remove this file from browser storage"
                    >
                      Remove
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      ) : localFiles ? (
        <Notification type="info">No previously-provided images</Notification>
      ) : null}
    </div>
  );
};

export default LocalStorageChooser;
