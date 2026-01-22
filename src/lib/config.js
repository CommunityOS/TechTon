export const organizer = {
    name: "CommunityOS",
    logo: "",
    url: "https://www.instagram.com/communityos.io/",
    description: "",
    social: {
        twitch: "https://www.twitch.tv/CommunityOS",
        twitter: "https://x.com/CommunityOS_",
        instagram: "https://www.instagram.com/communityos.io/",
        blueSky: "https://bsky.app/profile/communityosio.bsky.social",
        facebook: "https://www.facebook.com/profile.php?id=61581701850247",
        linkedin: "https://www.linkedin.com/company/communityos/",
        youtube: "https://www.youtube.com/@CommunityOS",
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
            title: "Sumate a la organización",
        },
    }
}

export const donations = {
    title: "Donaciones",
    dollarToClp: 874.4,
    seconds: 1000,
    local: {
        title: "Donaciones Nacionales",
        buttonTitle: "Donar",
        currency: "CLP",
        buttonURL: "https://link.mercadopago.cl/ninaspro",
        system: "mercadopago",
        numberFormat: "es-ES"
    },
    foreign: {
        title: "Donaciones Internacionales",
        buttonTitle: "Donar",
        currency: "USD",
        buttonURL: "https://buy.stripe.com/dR64jQcNI2Up0OkdR0",
        system: "stripe",
        numberFormat: "es-ES"
    }
}


export const steps = {
    hasShowedDonations: false,
    hasShowedSpeakers: false,
    hasShowedHosts: false,
    hasShowedCommunities: false,
    hasShowedButtontoDonate: false,
    hasTwitchButton: true,
}