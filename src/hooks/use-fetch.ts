import { useState } from "react";

const useFetch = () =>{
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
}