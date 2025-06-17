import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

let db = null;

export const useAuthDatabase = () => {

}