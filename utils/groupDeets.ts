type GroupConfig = {
    groupId: number,
    name: string,
    description: string,
    manager: string,
}

const twitterGroups = (start: number): GroupConfig[] => {
    const arr1 = ['>=100', '>=1k', '>=10k', '>=100k'].map((kind, id) => {
        return {
            groupId: start + id,
            name: `Twitter Followers ${kind}`,
            description: `Twitter Followers ${kind}`,
            manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
        } as GroupConfig;
    })

    const arr2 = ['Blue', 'Government', 'Institution'].map((kind, id) => {
        return {
            groupId: start + arr1.length + id,
            name: `Twitter Verified - ${kind}`,
            description: `Twitter Verified - ${kind}`,
            manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
        } as GroupConfig;
    })

    return arr1.concat(arr2);
}

export const details: GroupConfig[] = [
    {
        groupId: 0,
        name: 'Sign In - Reserved',
        description: 'Sign In - Reserved',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20'
    }, {
        groupId: 1,
        name: 'Social Recovery',
        description: 'Social Recovery',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20'
    }, {
        groupId: 2,
        name: 'Age >= 13',
        description: 'Age >= 13',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20'
    }, {
        groupId: 3,
        name: 'Age >= 18',
        description: 'Age >= 18',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20'
    }, {
        groupId: 4,
        name: 'Age >= 21',
        description: 'Age >= 21',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20'
    }, {
        groupId: 5,
        name: 'Student Status',
        description: 'Student Status',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20'
    }].concat(twitterGroups(6)).concat([
        {
            groupId: 256,
            name: 'Citizenship - India',
            description: 'Citizenship - India',
            manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20'
        }
    ]);

export const getGroupInfo = (groupId: number): GroupConfig => {
    return details.filter(e => e.groupId === groupId)[0];
}