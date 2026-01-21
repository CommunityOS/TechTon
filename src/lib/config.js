export const organizer = {
    name: "CommunityOS",
    logo: "",
    url: "https://www.instagram.com/communityos.io/",
    description: "",
    social: {
        twitter: "https://twitter.com/communityos",
        instagram: "https://www.instagram.com/communityos.io/",
        facebook: "https://www.facebook.com/communityos",
        linkedin: "https://www.linkedin.com/company/communityos",
        youtube: "https://www.youtube.com/channel/UC_x5XG1OV2P6BVIhLljUz9A",
    }
}

export const event = {
    name: "TechTon",
    speakers: 30,
    hours: 20,
    initialIncident: new Date("2026-01-16"),
    place: "Región del Bíobio de Chile",
    dates: [new Date("2026-01-23"), new Date("2026-01-24")],
    time: "18:00",
    location: "Santiago, Chile",
    days: [{
        day: "Viernes",
        date: "23",
        time: "18:00",
        timeZone: "GMT-3"
    }, {
        day: "Sábado",
        date: "24",
        time: "07:00",
        timeZone: "GMT-3"
    }],
    description: "",
    social: {
        twitter: "https://twitter.com/techton",
        instagram: "https://www.instagram.com/techton",
        facebook: "https://www.facebook.com/techton",
        linkedin: "https://www.linkedin.com/company/techton",
        youtube: "https://www.youtube.com/channel/UC_x5XG1OV2P6BVIhLljUz9A",
    },
    forms: {
        communities: {
            url: "https://communityos.neetoform.com/fedce81831aaf6858a7c ",
            title: "Sumate como Comunidad",
        },
        speakers: {
            url: "https://communityos.neetoform.com/891a19977d9d6a94c9ec",
            title: "Sumate como Charlista",
        },
        hosts: {
            url: "https://communityos.neetoform.com/4b6e94757c73607ba7e0",
            title: "Sumate como Host",
        },
    }
}

export const donations = {
    title: "Donaciones",
    dollarToClp: 969,
    seconds: 1000,
    local: {
        title: "Donaciones Nacionales",
        buttonTitle: "Donar",
        buttonURL: "https://link.mercadopago.cl/jscl",
        system: "mercadopago"
    },
    foreign: {
        title: "Donaciones Internacionales",
        buttonTitle: "Donar",
        buttonURL: "https://buy.stripe.com/dR64jQcNI2Up0OkdR0",
        system: "stripe"
    }
}