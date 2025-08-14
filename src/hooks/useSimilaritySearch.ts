//APIフォルダ内のファイルにて行っている処理を実行
import { useState, useEffect } from "react";

import { fetchNovels } from "../utils/api";

import { Novel } from "../types/novel.d";

import { pipeline } from "@xenova /transformers"