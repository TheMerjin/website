import { s as supabase } from '../../../chunks/supabase_DW_cx3tm.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const username = formData.get("username")?.toString();
  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username
      }
    }
  });
  if (signUpError) {
    if (signUpError.message === "User already registered") {
      return Response.redirect(
        `${"http://localhost:4321/"}login?msg=User%20already%20registered`,
        303
      );
    }
    return new Response(signUpError.message, { status: 500 });
  }
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();
  if (getUserError || !user) {
    console.error("Error fetching user:", getUserError);
    return new Response("Failed to fetch user info", { status: 500 });
  }
  const userId = user.id;
  const { data, error: insertError } = await supabase.from("profiles").insert([{ id: userId, username, bio: "Hello, I am new here!", email }]).select();
  if (insertError) {
    console.error("Error inserting profile:", insertError);
    return new Response("Failed to create profile", { status: 500 });
  }
  console.log("Profile created:", data);
  const welcomeNoteContent = `# Welcome to Your Notes! 📝

Hello ${username || "there"}! Welcome to your personal notes space.

## Getting Started

- **Create a new note**: Press \`Ctrl+N\` or click the \`+\` button
- **Save your note**: Press \`Ctrl+S\` or just keep typing (auto-save)
- **Switch between notes**: Click on any note in the sidebar
- **Use command mode**: Press \`ESC\` then type \`:\` for commands

## Available Commands

- \`:new {notename}\` - Create a new note with a custom title
- \`:w\` - Save current note
- \`:help\` - Show all available commands

## Tips

- Your notes are automatically saved as you type
- Use Markdown for formatting (bold, italic, links, etc.)
- Press \`ESC\` to enter NORMAL mode for navigation
- Press \`ESC\` again to return to INSERT mode for typing

Happy note-taking! ✨

---
*Created on ${(/* @__PURE__ */ new Date()).toLocaleDateString()}*`;
  const { error: noteError } = await supabase.from("notes").insert([{
    user_id: userId,
    title: "Welcome",
    content: welcomeNoteContent
  }]);
  if (noteError) {
    console.error("Error creating welcome note:", noteError);
  } else {
    console.log("Welcome note created for user:", userId);
  }
  return Response.redirect(`${"http://localhost:4321/"}login?msg=Registration%20successful`, 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
