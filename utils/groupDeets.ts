export enum Category {
    Omnid = "omnid",
    Gov = "gov",
    Social = "social",
    Misc = "misc",
}

export type GroupConfig = {
    name: string,
    description: string,
    manager: string,
    category: Category
}

export type GroupDetails = Record<string, GroupConfig>;

const twitterGroups = (start: number): GroupDetails => {
    let groups: GroupDetails = {};

    const arr1 = ['>=100', '>=1k', '>=10k', '>=100k'].forEach((kind, id) => {
        groups[start + id] = {
            name: `Twitter Followers ${kind}`,
            description: `Twitter Followers ${kind}`,
            manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
            category: Category.Social
        }
    })

    const arr2 = ['Blue', 'Government', 'Institution'].forEach((kind, id) => {
        groups[start + 4 + id] = {
            name: `Twitter Verified - ${kind}`,
            description: `Twitter Verified - ${kind}`,
            manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
            category: Category.Social
        }
    })

    return groups;
}

export const groupsMetadata: GroupDetails = {
    '0': {
        name: 'Sign In - Reserved',
        description: 'Sign In - Reserved',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
        category: Category.Omnid,
    },
    '1': {
        name: 'Social Recovery',
        description: 'Social Recovery',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
        category: Category.Omnid,
    },
    '2': {
        name: 'Age >= 13',
        description: 'Age >= 13',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
        category: Category.Gov,
    },
    '3': {
        name: 'Age >= 18',
        description: 'Age >= 18',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
        category: Category.Gov,
    },
    '4': {
        name: 'Age >= 21',
        description: 'Age >= 21',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
        category: Category.Gov,
    },
    '5': {
        name: 'Student Status',
        description: 'Student Status',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
        category: Category.Misc,
    },
    ...twitterGroups(6),
    '256': {
        name: 'Citizenship - India',
        description: 'Citizenship - India',
        manager: '0x707aC3937A9B31C225D8C240F5917Be97cab9F20',
        category: Category.Gov
    }
};