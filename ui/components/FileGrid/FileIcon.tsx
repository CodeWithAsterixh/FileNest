import React from "react";
import { BiMusic, BiVideo } from "react-icons/bi";
import {
  BsFile,
  BsFileImage,
  BsFiletypeAi,
  BsFiletypeBmp,
  BsFiletypeCss,
  BsFiletypeCsv,
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypeGif,
  BsFiletypeHtml,
  BsFiletypeJs,
  BsFiletypeJson,
  BsFiletypePdf,
  BsFiletypePpt,
  BsFiletypePptx,
  BsFiletypePsd,
  BsFiletypeSvg,
  BsFiletypeTiff,
  BsFiletypeTxt,
  BsFiletypeXls,
  BsFiletypeXlsx,
  BsFiletypeXml,
  BsFileZip,
  BsMarkdown,
} from "react-icons/bs";
import { MdFileDownload } from "react-icons/md";
import { SiTypescript, SiYaml } from "react-icons/si";
import { TbFileUnknown } from "react-icons/tb";
import { fileType } from "./fileTypes";

type Props = {
  type: fileType;
};

export default function FileIcon({ type }: Props) {
  let icon = <TbFileUnknown />;

  switch (type) {
    case "doc":
      icon = <BsFiletypeDoc />;
      break;
    case "docx":
      icon = <BsFiletypeDocx />;
      break;
    case "pdf":
      icon = <BsFiletypePdf />;
      break;
    case "txt":
      icon = <BsFiletypeTxt />;
      break;
    case "ppt":
      icon = <BsFiletypePpt />;
      break;
    case "pptx":
      icon = <BsFiletypePptx />;
      break;
    case "xlsx":
      icon = <BsFiletypeXlsx />;
      break;
    case "xls":
      icon = <BsFiletypeXls />;
      break;
    case "csv":
      icon = <BsFiletypeCsv />;
      break;
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      icon = <BsFileZip />;
      break;
    case "html":
      icon = <BsFiletypeHtml />;
      break;
    case "css":
      icon = <BsFiletypeCss />;
      break;
    case "js":
      icon = <BsFiletypeJs />;
      break;
    case "ts":
      icon = <SiTypescript />;
      break;
    case "json":
      icon = <BsFiletypeJson />;
      break;
    case "xml":
      icon = <BsFiletypeXml />;
      break;
    case "yaml":
      icon = <SiYaml />;
      break;
    case "md":
      icon = <BsMarkdown />;
      break;
    case "svg":
      icon = <BsFiletypeSvg />;
      break;
    case "gif":
      icon = <BsFiletypeGif />;
      break;
    case "bmp":
      icon = <BsFiletypeBmp />;
      break;
    case "tiff":
      icon = <BsFiletypeTiff />;
      break;
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
      icon = <BiMusic />;
      break;
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
    case "webm":
      icon = <BiVideo />;
      break;
    case "exe":
    case "apk":
    case "dmg":
    case "iso":
      icon = <MdFileDownload />;
      break;
    case "psd":
      icon = <BsFiletypePsd />;
      break;
    case "ai":
      icon = <BsFiletypeAi />;
      break;
    case "image":
      icon = <BsFileImage />;
      break;
    case "documents":
      icon = <BsFile />;
      break;
    case "unknown":
    default:
      icon = <TbFileUnknown />;
      break;
  }

  return icon;
}
