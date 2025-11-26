'use client'

import React, { useEffect, useState } from 'react'
import PeopleTable from './Table'
import { useParams } from 'next/navigation';
import * as client from "../../client"

export default function People() {
    const {cid} = useParams();
    const [users, setUsers] = useState<any[]>([]);
    const fetchUsers = async () => {
        const users = await client.findUsersForCourse(cid as string);
        setUsers(users);
    };

    useEffect(() => {
        fetchUsers();
    }, [cid]);
    return (
        <PeopleTable  users={users} fetchUsers={fetchUsers}/>
    )
}