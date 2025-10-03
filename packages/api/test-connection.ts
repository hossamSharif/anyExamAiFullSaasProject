import 'dotenv/config';
import { supabase } from './src/supabase';

async function testConnection() {
  console.log('Testing Supabase connection...\n');

  try {
    // Test 1: Basic connection
    const { data, error } = await supabase.from('_test').select('*').limit(1);

    if (error && error.code === 'PGRST204') {
      console.log('✅ Connection successful! (No tables found yet - this is expected)');
    } else if (error && error.message.includes('relation')) {
      console.log('✅ Connection successful! (No tables found yet - this is expected)');
    } else if (error) {
      console.log('⚠️  Connection established but got error:', error.message);
    } else {
      console.log('✅ Connection successful!');
    }

    // Test 2: Get Supabase URL
    const url = supabase.supabaseUrl;
    console.log('\n📍 Supabase URL:', url);

    // Test 3: Check auth
    const { data: session } = await supabase.auth.getSession();
    console.log('\n🔐 Auth status:', session.session ? 'Active session' : 'No active session (expected)');

    console.log('\n✨ Supabase is ready to use!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err);
    process.exit(1);
  }
}

testConnection();
