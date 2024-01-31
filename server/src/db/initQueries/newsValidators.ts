export const newsValidatorsSchema = `
    CREATE TABLE public.news_validators (
        id integer NOT NULL,
        title text NOT NULL,
        subtitle text NOT NULL,
        version_op VARCHAR(3),
        version VARCHAR(10),
        link text,
        cta text,
        visible boolean DEFAULT false NOT NULL,
        cta_color text DEFAULT 'success'::text NOT NULL
    );


    ALTER TABLE public.news_validators OWNER TO postgres;

    --
    -- TOC entry 257 (class 1259 OID 18296)
    -- Name: news_validators_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
    --

    CREATE SEQUENCE public.news_validators_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;


    ALTER TABLE public.news_validators_id_seq OWNER TO postgres;

    --
    -- TOC entry 3136 (class 0 OID 0)
    -- Dependencies: 257
    -- Name: news_validators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
    --

    ALTER SEQUENCE public.news_validators_id_seq OWNED BY public.news_validators.id;


    --
    -- TOC entry 2994 (class 2604 OID 18298)
    -- Name: news_validators id; Type: DEFAULT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.news_validators ALTER COLUMN id SET DEFAULT nextval('public.news_validators_id_seq'::regclass);


    --
    -- TOC entry 3129 (class 0 OID 18288)
    -- Dependencies: 256
    -- Data for Name: news_validators; Type: TABLE DATA; Schema: public; Owner: postgres
    --

    INSERT INTO news_validators (title, subtitle, link, cta, visible, cta_color)
    VALUES ('Stake Mina and earn interest', 'When you stake your Mina, you delegate your stake to a validator who will be in charge of securing the network. Your funds will not leave your wallet, neither will be locked. When producing blocks, a validator generates an income, which then is usually shared with the delegator.', 'https://minaprotocol.com/', 'Learn more', true, 'success');


    --
    -- TOC entry 3137 (class 0 OID 0)
    -- Dependencies: 257
    -- Name: news_validators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
    --

    SELECT pg_catalog.setval('public.news_validators_id_seq', 1, true);


    --
    -- TOC entry 2996 (class 2606 OID 18300)
    -- Name: news_validators news_validators_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
    --

    ALTER TABLE ONLY public.news_validators
        ADD CONSTRAINT news_validators_pkey PRIMARY KEY (id);
`
