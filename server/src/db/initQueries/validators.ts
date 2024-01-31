export const validatorsSchema = `

--
-- Name: validators; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.validators (
    name text NOT NULL,
    website text NOT NULL,
    "publicKey" text NOT NULL,
    id integer NOT NULL,
    image text,
    "payoutTerms" text,
    "stakePercent" text,
    "stakedSum" text,
    twitter text,
    telegram text,
    github text,
    email text,
    "discordUsername" text,
    "discordGroup" text,
    "delegatorsNum" text,
    fee numeric,
    "providerId" numeric,
    priority numeric DEFAULT 99
);


ALTER TABLE public.validators OWNER TO postgres;

--
-- Name: validators_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.validators_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.validators_id_seq OWNER TO postgres;

--
-- Name: validators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.validators_id_seq OWNED BY public.validators.id;


--
-- Name: validators id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validators ALTER COLUMN id SET DEFAULT nextval('public.validators_id_seq'::regclass);


--
-- Name: validators validators_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validators
    ADD CONSTRAINT validators_name_key UNIQUE (name);


--
-- Name: validators validators_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validators
    ADD CONSTRAINT validators_pkey PRIMARY KEY (id);


--
-- Name: validators validators_publicKey_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validators
    ADD CONSTRAINT "validators_publicKey_key" UNIQUE ("publicKey");
`;
