import streamlit as st
from ollama import generate, chat
import json
import re

# --- CONFIGURATION ---
st.set_page_config(layout="wide", page_title="C++ Coding Debate")

# Add a text input for the model name in the sidebar
st.sidebar.title("Configuration")
OLLAMA_MODEL = st.sidebar.text_input("Ollama Model Name", value="llama3.2:1b")

# --- UI STYLING ---
def load_css():
    st.markdown("""
    <style>
        .stButton>button {
            width: 100%;
            height: 50px;
        }
        .stChatMessage {
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 1rem;
            min-height: 100px;
        }
    </style>
    """, unsafe_allow_html=True)
load_css()

# --- STATE MANAGEMENT ---
def init_session_state():
    keys = ["debate_topic", "character_views", "history", "discussion_log", "view_mode"]
    for key in keys:
        if key not in st.session_state:
            if key in ["history", "discussion_log"]:
                st.session_state[key] = []
            elif key == "view_mode":
                st.session_state[key] = "debate" # Modes: debate, single_char
            else:
                st.session_state[key] = None
    if "show_initial_screen" not in st.session_state:
        st.session_state.show_initial_screen = True

init_session_state()

# --- PROMPT ENGINEERING ---
def get_algorithm_choices_prompt(topic):
    return f"""
    You are a moderator for a C++ debate on: "{topic}".
    Assign a relevant sorting algorithm to each persona. 'DP Master' prefers robust, stable, recursive methods. 'Greedy Rebel' prefers faster, in-place, non-stable methods.
    Respond in valid, raw JSON. The JSON object should have a single key "characters" which is an array of two objects.
    {{
      "characters": [
        {{ "name": "DP Master", "algorithm": "Merge Sort" }},
        {{ "name": "Greedy Rebel", "algorithm": "Quick Sort" }}
      ]
    }}
    """

def get_argument_prompt(character_name, algorithm_name, topic):
    return f"""
    You are {character_name} and you are in a C++ debate on the topic: '{topic}'.
    Your assigned algorithm is {algorithm_name}.
    You MUST provide a single, concise, one-sentence argument specifically for {algorithm_name}, and no other algorithm.
    Your argument should highlight a key strength of {algorithm_name}.
    Format the response EXACTLY like this:
    ARGUMENT: [Your one-sentence argument here.]
    """

def get_elaboration_prompt(character, topic, history):
    return f"You are {character['name']}. The topic is '{topic}'. Your algorithm is {character['algorithm']}. Elaborate on your position based on the history: {''.join(history)}. Be consistent with your algorithm's known complexity and use cases. Respond in Markdown."

def get_new_example_prompt(topic, history):
    return f"Moderator: The topic is '{topic}'. History: {''.join(history)}. Introduce a new, complex example (e.g., sorting nearly-sorted data, or data with many duplicates) and have both characters argue for their algorithm's suitability. Respond in Markdown."

# --- MODEL & HELPER FUNCTIONS ---
def get_model_response(prompt):
    with st.spinner(f"_The debaters are thinking..._ "):
        try:
            response = generate(model=OLLAMA_MODEL, prompt=prompt)
            return response['response']
        except Exception as e:
            st.error(f"Error calling model: {e}")
            return None

def extract_json(text):
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try: return json.loads(match.group(0))
        except json.JSONDecodeError: return None
    return None

def parse_argument(text):
    try:
        argument = re.search(r"ARGUMENT: (.*)", text).group(1)
        return argument
    except (AttributeError, IndexError):
        return "(Argument not found)"

# --- UI RENDERING ---
def render_main_view():
    render_debate_view(st.session_state.character_views)
    render_discussion_log()
    render_user_choices(st.session_state.character_views)

def render_debate_view(views):
    st.header(f"Debate Topic: {st.session_state.debate_topic}")
    st.markdown("---")
    col1, col2 = st.columns(2)
    with col1:
        with st.container(border=True):
            char_info = views['character2']
            st.subheader(f"👩‍🎤 {char_info['name']} advocates for {char_info['algorithm']}")
            st.markdown(f"> *{char_info['argument'].strip()}*")
    with col2:
        with st.container(border=True):
            char_info = views['character1']
            st.subheader(f"👨‍💻 {char_info['name']} advocates for {char_info['algorithm']}")
            st.markdown(f"> *{char_info['argument'].strip()}*")

def render_discussion_log():
    for item in st.session_state.discussion_log:
        if item["type"] == "debate":
            col1, col2 = st.columns(2)
            with col1:
                with st.container(border=True):
                    st.chat_message("assistant", avatar="👩‍🎤").markdown(item.get("greedy_rebel", ""))
            with col2:
                with st.container(border=True):
                    st.chat_message("assistant", avatar="👨‍💻").markdown(item.get("dp_master", ""))
        elif item["type"] == "single_response":
            avatar = "👨‍💻" if item["character_name"] == "DP Master" else "👩‍🎤"
            if item["character_name"] == "Moderator":
                avatar = "📜"
            st.chat_message("assistant", avatar=avatar).markdown(item["content"])

def render_user_choices(views):
    st.markdown("---")
    st.subheader("What's Your Next Move?")
    cols = st.columns(5)
    with cols[0]:
        if st.button(f"🗣️ Ask {views['character2']['name']}"):
            handle_choice("explore", 2)
    with cols[1]:
        if st.button(f"🗣️ Ask {views['character1']['name']}"):
            handle_choice("explore", 1)
    with cols[2]:
        if st.button("⚔️ Let Them Debate!"):
            handle_choice("debate")
    with cols[3]:
        if st.button("🔄 Compare New Example"):
            handle_choice("new_example")
    with cols[4]:
        if st.button("❓ New Topic"):
            handle_choice("new_topic")

# --- LOGIC HANDLERS ---
def start_new_debate(question):
    if not question: return
    init_session_state()
    st.session_state.show_initial_screen = False
    st.session_state.debate_topic = question
    st.session_state.history = [f"Initial Topic: {question}\n"]
    algo_prompt = get_algorithm_choices_prompt(question)
    algo_response = get_model_response(algo_prompt)
    algorithms_data = extract_json(algo_response)

    if not algorithms_data or 'characters' not in algorithms_data or len(algorithms_data['characters']) != 2:
        st.error("Failed to get algorithm choices. Please try again.")
        st.session_state.show_initial_screen = True
        return

    st.session_state.character_views = {}
    char_map = {'DP Master': 'character1', 'Greedy Rebel': 'character2'}
    for char_info in algorithms_data['characters']:
        char_key = char_map[char_info['name']]
        arg_prompt = get_argument_prompt(char_info['name'], char_info['algorithm'], question)
        arg_response = get_model_response(arg_prompt)
        argument = parse_argument(arg_response)
        st.session_state.character_views[char_key] = {"name": char_info['name'], "algorithm": char_info['algorithm'], "argument": argument}
    st.rerun()

def handle_choice(choice, char_index=None):
    st.session_state.view_mode = "debate"
    views = st.session_state.character_views

    if choice == "new_topic":
        init_session_state()
        st.session_state.show_initial_screen = True
        st.rerun()

    elif choice == "explore":
        st.session_state.view_mode = "single_char"
        character = views[f'character{char_index}']
        prompt = get_elaboration_prompt(character, st.session_state.debate_topic, st.session_state.history)
        response = get_model_response(prompt)
        if response:
            log_item = {"type": "single_response", "character_name": character['name'], "content": response}
            st.session_state.discussion_log.append(log_item)
            st.session_state.history.append(response + "\n")
        st.rerun()

    elif choice == "new_example":
        st.session_state.view_mode = "single_char"
        prompt = get_new_example_prompt(st.session_state.debate_topic, st.session_state.history)
        response = get_model_response(prompt)
        if response:
            log_item = {"type": "single_response", "character_name": "Moderator", "content": response}
            st.session_state.discussion_log.append(log_item)
            st.session_state.history.append(response + "\n")
        st.rerun()

    elif choice == "debate":
        st.session_state.view_mode = "single_char"

        # 시스템 메시지
        system_dp = {"role": "system", "content": "DP Master의 설정 메시지"}
        system_other = {"role": "system", "content": "Greedy Rebel 설정 메시지"}

        # 대화 기록 초기화
        local_chat_history = [{"role": "user", "content": st.session_state.debate_topic}]
        st.session_state.discussion_log = []

        for i in range(3):
            # DP Master 응답
            dp_history = [system_dp] + local_chat_history
            dp_response = chat(model=OLLAMA_MODEL, messages=dp_history, stream=False).message.content
            if not dp_response.strip(): dp_response = "(DP Master seems lost in thought...)"
            local_chat_history.append({"role": "assistant", "content": dp_response})

            # Greedy Rebel 응답
            other_history = [system_other, {"role": "user", "content": ""}]
            for history_item in local_chat_history:
                # 역할 뒤집기
                history_item_copy = history_item.copy()
                history_item_copy['role'] = 'user' if history_item['role'] == 'assistant' else 'assistant'
                other_history.append(history_item_copy)

            other_response = chat(model=OLLAMA_MODEL, messages=other_history, stream=False).message.content
            if not other_response.strip(): other_response = "(Greedy Rebel rolls their eyes.)"
            local_chat_history.append({"role": "assistant", "content": other_response})

            # 토론 로그에 저장
            turn_content = f"**DP Master:**\n{dp_response}\n\n---\n\n**Greedy Rebel:**\n{other_response}"
            st.session_state.discussion_log.append({"type": "single_response", "character_name": "Moderator", "content": turn_content})

        # 토론 기록에 추가
        st.session_state.history.append(json.dumps(st.session_state.discussion_log[-3:]) + "\n")
        st.rerun()


# --- MAIN APP ---
if st.session_state.show_initial_screen:
    st.title("⚔️ C++ Coding Debate ⚔️")
    st.header("What should the algorithms debate about today?")
    user_question = st.text_input("Enter a topic, e.g., 'What is the best sorting algorithm?'", key="user_q")
    if st.button("Start Debate!", key="start_b", use_container_width=True):
        start_new_debate(user_question)
else:
    render_main_view()
